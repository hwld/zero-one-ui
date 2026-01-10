"use client";

import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiCalendarBlank } from "@react-icons/all-files/pi/PiCalendarBlank";
import { PiAlarm } from "@react-icons/all-files/pi/PiAlarm";
import { PiFlag } from "@react-icons/all-files/pi/PiFlag";
import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { Button } from "../../_components/button";
import { type TaskFormData } from "../../_backend/task/schema";
import { PiCaretDownLight } from "@react-icons/all-files/pi/PiCaretDownLight";
import { useTaskForm } from "./use-task-form";
import { Popover } from "../../_components/popover";
import { Command } from "cmdk";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { UserIcon } from "../../_components/user-icon";
import { useTaskboxNodes } from "../taskbox/taskbox-nodes-provider";
import type { TaskboxNodes } from "../taskbox/taskbox";
import { PiCheckBold } from "@react-icons/all-files/pi/PiCheckBold";

type Props = {
  size?: "md" | "sm";
  defaultValues?: Partial<TaskFormData>;
  onCancel: () => void;
  onSubmit: (input: TaskFormData) => void;
  submitText: string;
  isSubmitting: boolean;
};

export const TaskForm: React.FC<Props> = ({
  size = "md",
  defaultValues,
  onCancel,
  onSubmit,
  submitText,
  isSubmitting,
}) => {
  const taskboxNodes = useTaskboxNodes();

  const {
    register,
    handleSubmit,
    formState: { isValid, errorMessagesWithoutTooSmall },
    trigger,
    submitRef,
    handleFormKeyDown,
    watch,
    setValue,
  } = useTaskForm({
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      taskboxId: defaultValues?.taskboxId ?? taskboxNodes.inbox.taskboxId,
      parentId: null,
    },
    onCancel,
  });

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickForm = () => {
    titleInputRef.current?.focus();
  };

  const watchedTaskboxId = watch("taskboxId");
  const handleSelectTaskboxId = (id: string) => {
    setValue("taskboxId", id, { shouldValidate: true });
  };

  // taskboxIdが存在しない場合にフィールドをクリアする
  useEffect(() => {
    if (
      !(taskboxNodes.inbox.taskboxId === watchedTaskboxId) &&
      !taskboxNodes.projectNodes.find((p) => p.taskboxId === watchedTaskboxId)
    ) {
      setValue("taskboxId", "", { shouldValidate: true });
    }
  }, [setValue, taskboxNodes, watchedTaskboxId]);

  useEffect(() => {
    // 初期レンダリングでエラーを表示させる
    trigger();
  }, [trigger]);

  return (
    <div onKeyDown={handleFormKeyDown}>
      <div
        className="grid cursor-pointer grid-rows-[auto_auto] gap-2 p-4"
        onClick={handleClickForm}
      >
        <div className="grid grid-rows-[auto_auto_auto] gap-1">
          <input
            autoFocus
            {...register("title")}
            ref={(e) => {
              register("title").ref(e);
              titleInputRef.current = e;
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="タスク名"
            className={clsx(
              "border-none bg-transparent font-bold tracking-wide text-stone-700 outline-hidden placeholder:font-bold placeholder:text-stone-400",
              { md: "text-lg", sm: "" }[size],
            )}
          />
          <textarea
            {...register("description")}
            placeholder="説明"
            className="resize-none bg-transparent text-stone-700 outline-hidden placeholder:text-stone-400"
            rows={3}
            onClick={(e) => e.stopPropagation()}
          />
          {errorMessagesWithoutTooSmall.length > 0 && (
            <p className="text-xs text-red-600">
              {errorMessagesWithoutTooSmall[0]}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Select icon={PiCalendarBlank}>予定日</Select>
          <Select icon={PiFlag}>優先度</Select>
          <Select icon={PiAlarm}>リマインダー</Select>
          <button
            className={clsx(buttonClass, "grid size-7 place-items-center")}
          >
            <PiDotsThreeBold className="size-5 text-stone-900" />
          </button>
        </div>
      </div>
      <hr />
      <div
        className={clsx(
          "flex items-center justify-between gap-2",
          { sm: "p-2", md: "p-4" }[size],
        )}
      >
        <TaskBoxSelectPopover
          taskboxNodes={taskboxNodes}
          selectedTaskboxId={watchedTaskboxId}
          onSelect={handleSelectTaskboxId}
        />
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button
            ref={submitRef}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {submitText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const buttonClass =
  "border border-stone-300 text-stone-500 hover:bg-stone-500/10 rounded-sm transition-colors";

const Select: React.FC<PropsWithChildren & { icon: IconType }> = ({
  children,
  icon: Icon,
}) => {
  return (
    <button
      className={clsx(
        "group grid h-7 grid-cols-[auto_1fr] items-center gap-1 px-2 text-xs",
        buttonClass,
      )}
    >
      <Icon className="size-4 group-hover:text-stone-900" />
      {children}
    </button>
  );
};

const TaskBoxSelectPopover: React.FC<{
  taskboxNodes: TaskboxNodes;
  selectedTaskboxId: string;
  onSelect: (id: string) => void;
}> = ({ taskboxNodes, selectedTaskboxId, onSelect }) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterValueChange = (filter: string) => {
    if (filter === "") {
      setIsFiltering(false);
    } else {
      setIsFiltering(true);
    }
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
  };

  const triggerInfo = (() => {
    if (selectedTaskboxId === taskboxNodes.inbox.taskboxId) {
      return { label: "インボックス", icon: PiTrayLight };
    }

    const project = taskboxNodes.projectNodes.find(
      (p) => p.taskboxId === selectedTaskboxId,
    );
    if (project) {
      return { label: project.label, icon: PiHashLight };
    }

    return { label: "プロジェクトが選択されていません", icon: undefined };
  })();

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          color="transparent"
          leftIcon={triggerInfo.icon}
          rightIcon={PiCaretDownLight}
        >
          {triggerInfo.label}
        </Button>
      }
    >
      <Command className="flex h-full flex-col" loop>
        <div className="grid p-2">
          <Command.Input
            onValueChange={handleFilterValueChange}
            placeholder="プロジェクト名を入力"
            className="h-8 rounded-sm border border-stone-300 bg-transparent px-2 outline-hidden focus-visible:border-stone-400"
          />
        </div>
        <div className="h-px w-full bg-stone-200" />
        <div className="flex min-h-0 flex-col overflow-auto">
          <Command.Empty className="p-2">
            プロジェクトが見つかりません
          </Command.Empty>

          <Command.List>
            {taskboxNodes ? (
              <>
                <Command.Group>
                  <TaskBoxSelectItem
                    icon={PiTrayLight}
                    label="インボックス"
                    depth={0}
                    value={taskboxNodes.inbox.taskboxId}
                    selected={
                      taskboxNodes.inbox.taskboxId === selectedTaskboxId
                    }
                    onSelect={handleSelect}
                  />
                </Command.Group>
                <Command.Group>
                  {isFiltering ? null : (
                    <div className="grid h-8 grid-cols-[auto_1fr] items-center gap-2 px-2 font-bold">
                      <UserIcon size="sm" />
                      マイプロジェクト
                    </div>
                  )}
                  {taskboxNodes.projectNodes.map((project) => {
                    // フィルタリング中はフラットに表示させる
                    const depth = isFiltering ? 0 : 1 + project.depth;

                    return (
                      <TaskBoxSelectItem
                        key={project.taskboxId}
                        icon={PiHashLight}
                        label={project.label}
                        depth={depth}
                        value={project.taskboxId}
                        onSelect={handleSelect}
                        selected={project.taskboxId === selectedTaskboxId}
                      />
                    );
                  })}
                </Command.Group>
              </>
            ) : null}
          </Command.List>
        </div>
      </Command>
    </Popover>
  );
};

const TaskBoxSelectItem: React.FC<{
  icon: IconType;
  label: string;
  depth: number;
  value: string;
  selected: boolean;
  onSelect?: (value: string) => void;
}> = ({ icon: Icon, label, value, onSelect, selected, depth }) => {
  // valueでもフィルタリングされてしまうので、意図しないフィルタリングが発生する可能性がある
  // 将来のリリースでdefailtFilterがexportされそうなので、その使い方で制御できそうな気がする
  // https://github.com/pacocoursey/cmdk/pull/229

  return (
    <Command.Item
      style={{ paddingLeft: `${10 * (depth + 1)}px`, paddingRight: "10px" }}
      className="grid h-8 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-1 text-stone-600 data-[selected='true']:bg-black/5"
      value={value}
      key={value}
      onSelect={onSelect}
      keywords={[label]}
    >
      <Icon className="size-4" />
      {label}
      {selected ? <PiCheckBold className="text-rose-600" /> : null}
    </Command.Item>
  );
};
