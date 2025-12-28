import { Button } from "../../_components/button";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { IconButton } from "../../_components/icon-button";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiXLight } from "@react-icons/all-files/pi/PiXLight";
import { PiCaretDownLight } from "@react-icons/all-files/pi/PiCaretDownLight";
import { PiCaretUpLight } from "@react-icons/all-files/pi/PiCaretUpLight";
import { Tooltip, TooltipDelayGroup } from "../../_components/tooltip";
import { useTask } from "./use-task";
import { TaskCheckbox } from "./task-checkbox";
import { useUpdateTaskDone } from "./use-update-task-done";
import clsx from "clsx";
import { Separator } from "../../_components/separator";
import type { IconType } from "@react-icons/all-files";
import { PiCalendarLight } from "@react-icons/all-files/pi/PiCalendarLight";
import { PiFlagLight } from "@react-icons/all-files/pi/PiFlagLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiLockLight } from "@react-icons/all-files/pi/PiLockLight";
import { PiPaperclipLight } from "@react-icons/all-files/pi/PiPaperclipLight";
import { PiTextAlignLeftLight } from "@react-icons/all-files/pi/PiTextAlignLeftLight";
import { useState, type ReactNode } from "react";
import { UserIcon } from "../../_components/user-icon";
import type { Task } from "../../_backend/task/model";
import { type TaskFormData } from "../../_backend/task/schema";
import { useUpdateTask } from "./use-update-task";
import { useTaskForm } from "./use-task-form";
import { PiSpinnerGap } from "@react-icons/all-files/pi/PiSpinnerGap";
import { PiWarningCircle } from "@react-icons/all-files/pi/PiWarningCircle";

type Props = { taskId: string | null; onClose?: () => void };

export const TaskDetailModalContent: React.FC<Props> = ({
  taskId,
  onClose,
}) => {
  return (
    <TooltipDelayGroup>
      <div className="grid h-12 grid-cols-[1fr_auto] items-center gap-4 border-b border-stone-200 px-2">
        <div className="w-min">
          <Button color="transparent" leftIcon={PiTrayLight}>
            インボックス
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip label="前のタスク" keys={["K"]} placement="top">
            <IconButton icon={PiCaretUpLight} />
          </Tooltip>
          <Tooltip label="次のタスク" keys={["J"]} placement="top">
            <IconButton icon={PiCaretDownLight} />
          </Tooltip>
          <Tooltip label="その他のアクション" placement="top">
            <IconButton icon={PiDotsThreeOutlineLight} />
          </Tooltip>
          {onClose ? (
            <Tooltip label="タスクを閉じる" placement="top">
              <IconButton icon={PiXLight} onClick={onClose} />
            </Tooltip>
          ) : null}
        </div>
      </div>
      <div className="grid h-[750px] grid-cols-[1fr_auto]">
        <div className="overflow-auto">
          {taskId ? <TaskDetail taskId={taskId} /> : null}
        </div>
        <div className="w-[250px] rounded-br-lg bg-stone-100">
          <Sidebar />
        </div>
      </div>
    </TooltipDelayGroup>
  );
};

const TaskDetail: React.FC<{ taskId: string }> = ({ taskId }) => {
  const { data: task, status } = useTask(taskId);
  const udpateDone = useUpdateTaskDone();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateTaskDone = (done: boolean) => {
    if (!task) {
      return;
    }

    udpateDone.mutate({ id: taskId, done, taskboxId: task.taskboxId });
  };

  if (status === "pending") {
    return (
      <div className="grid size-full place-items-center">
        <PiSpinnerGap className="size-5 animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex size-full flex-col items-center gap-2 px-4 pt-10 pb-4 text-red-600">
        <PiWarningCircle className="size-7" />
        <div className="flex w-full flex-col items-center gap-1">
          <p className="text-sm">タスクが見つかりませんでした</p>
          <p className="text-xs">
            ※このアプリでは更新すると作成したデータは削除されます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 text-sm">
      <div className="grid grid-cols-[24px_1fr] items-start gap-2">
        <TaskCheckbox checked={task.done} onChange={handleUpdateTaskDone} />
        {isEditing ? (
          <TaskEditor task={task} onEndEdit={() => setIsEditing(false)} />
        ) : (
          <div
            className="flex min-w-0 cursor-pointer flex-col gap-2"
            onClick={() => setIsEditing(true)}
          >
            <button
              className={clsx(
                "text-start text-lg/5 font-bold break-all",
                task.done && "line-through",
              )}
            >
              {task.title}
            </button>
            <button className="text-start break-all whitespace-pre-wrap">
              {task.description ? (
                task.description
              ) : (
                <span className="flex items-center gap-1 text-stone-400 select-none">
                  <PiTextAlignLeftLight className="size-5" />
                  説明
                </span>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 pl-[32px]">
        <div className="w-min">
          <Button leftIcon={PiPlusLight} color="transparent">
            サブタスクを追加
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <UserIcon />
          <button className="flex h-8 items-center justify-between rounded-full border border-stone-300 px-2">
            <p className="text-stone-500">コメント</p>
            <PiPaperclipLight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskEditor: React.FC<{ task: Task; onEndEdit: () => void }> = ({
  task,
  onEndEdit,
}) => {
  const updateTask = useUpdateTask();
  const {
    register,
    handleSubmit,
    formState: { isValid, errorMessagesWithoutTooSmall },
    submitRef,
    handleFormKeyDown,
  } = useTaskForm({ defaultValues: task, onCancel: onEndEdit });

  const handleUpdateTask = (data: TaskFormData) => {
    updateTask.mutate(
      { id: task.id, ...data },
      {
        onSuccess: () => {
          onEndEdit();
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex w-full flex-col gap-2 rounded-lg border p-2"
        onKeyDown={handleFormKeyDown}
      >
        <input
          autoFocus
          className="bg-transparent text-lg/5 font-bold outline-hidden placeholder:text-stone-400"
          placeholder="タスク名"
          {...register("title")}
        />
        <textarea
          className="resize-none bg-transparent outline-hidden placeholder:text-stone-400"
          placeholder="説明"
          rows={3}
          {...register("description")}
        />
      </div>
      <div className="flex w-full items-center justify-between gap-4">
        <p className="text-xs text-red-600">
          {errorMessagesWithoutTooSmall[0]}
        </p>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onEndEdit}>
            キャンセル
          </Button>
          <Button
            ref={submitRef}
            onClick={handleSubmit(handleUpdateTask)}
            disabled={!isValid || updateTask.isPending}
            loading={updateTask.isPending}
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="p-4 text-xs">
      <div className="flex flex-col gap-2">
        <SidebarSelect
          title="プロジェクト"
          icon={PiTrayLight}
          label="インボックス"
        />
        <Separator />
        <SidebarSelect title="予定日" icon={PiCalendarLight} label="9月26日" />
        <Separator />
        <SidebarSelect title="優先度" icon={PiFlagLight} label="P4" />
        <Separator />
        <SidebarItem label="ラベル" icon={PiPlusLight} />
        <Separator />
        <SidebarItem label="リマインダー" icon={PiPlusLight} />
        <Separator />
        <SidebarItem
          label={
            <p className="flex items-center gap-1">
              位置情報
              <span className="flex h-[15px] items-center rounded-sm bg-orange-100 px-1 text-[10px] font-bold text-orange-800">
                アップグレード
              </span>
            </p>
          }
          icon={PiLockLight}
        />
      </div>
    </div>
  );
};

const sidebarItemClass =
  "flex h-7 items-center justify-between gap-2 rounded-sm px-1 transition-colors hover:bg-rose-100/70";

const SidebarSelect: React.FC<{
  title: string;
  icon: IconType;
  label: string;
}> = ({ title, label, icon: Icon }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium">{title}</p>
      <button className={clsx(sidebarItemClass, "group")}>
        <div className="flex items-center gap-1">
          <Icon className="size-4" />
          <p>{label}</p>
        </div>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <PiCaretDownLight className="size-4" />
        </div>
      </button>
    </div>
  );
};

const SidebarItem: React.FC<{ label: ReactNode; icon: IconType }> = ({
  label,
  icon: Icon,
}) => {
  return (
    <button className={clsx(sidebarItemClass)}>
      {label}
      <Icon className="size-4" />
    </button>
  );
};
