import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircleIcon,
  ArchiveIcon,
  CircleDotIcon,
  CopyIcon,
  PinIcon,
  PinOffIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useTask } from "../../_queries/use-task";
import { LoadingAnimation } from "../loading-animation";
import { Button } from "../button";
import { TaskDetailPanelMetaRow } from "./meta-row";
import { IconButton } from "../icon-button";
import { ListButton } from "../list-button";
import { UpdateTaskStatusMenuTrigger } from "./update-task-status-menu-trigger";
import { TaskTitleSection } from "./task-title-section";
import { TaskCommentSection } from "./task-comment-section";
import { forwardRef } from "react";

type Props = {
  taskId: string;
  isPinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
};

export const TaskDetailPanelContent: React.FC<Props> = ({
  taskId,
  onClose,
  isPinned,
  onTogglePin,
}) => {
  const { data: task, status } = useTask(taskId);

  const content = (() => {
    if (status === "pending") {
      return <LoadingContent />;
    } else if (status === "error") {
      return <ErrorContent onClose={onClose} />;
    } else if (status === "success") {
      return (
        <div className="@container size-full">
          <motion.div className="grid size-full grid-cols-1 grid-rows-[min-content_1fr] @3xl:grid-cols-[1fr_400px]">
            <div className="space-y-2 border-b border-neutral-600 p-4 @3xl:col-span-2">
              <div className="flex items-center justify-end gap-2">
                <IconButton
                  icon={isPinned ? PinOffIcon : PinIcon}
                  onClick={onTogglePin}
                />
                <IconButton icon={XIcon} onClick={onClose} />
              </div>
              <TaskTitleSection task={task} />
            </div>
            <div className="overflow-auto border-b border-neutral-600 p-4 @3xl:border-r @3xl:border-b-0">
              <TaskCommentSection task={task} />
            </div>
            <div className="grid grid-rows-[min-content_1fr]">
              <div className="space-y-2 border-b border-neutral-600 p-4">
                <TaskDetailPanelMetaRow label="Assignees">
                  <button className="h-full w-full rounded-sm px-2 text-start text-sm text-neutral-400 transition-colors hover:bg-white/15">
                    Add assigness...
                  </button>
                </TaskDetailPanelMetaRow>
                <TaskDetailPanelMetaRow label="Status">
                  <UpdateTaskStatusMenuTrigger task={task} />
                </TaskDetailPanelMetaRow>
              </div>
              <div className="space-y-1 p-4">
                <ListButton icon={CircleDotIcon} label="Convert to issue" />
                <ListButton icon={CopyIcon} label="Copy link in project" />
                <ListButton icon={ArchiveIcon} label="Archive" />
                <ListButton red icon={TrashIcon} label="Delete from project" />
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
  })();

  return <AnimatePresence mode="popLayout">{content}</AnimatePresence>;
};

const LoadingContent = forwardRef<HTMLDivElement, unknown>(
  function LoadingContent(_, ref) {
    return (
      <motion.div
        ref={ref}
        key="loading"
        className="grid size-full place-content-center place-items-center text-neutral-400"
        exit={{ opacity: 0 }}
      >
        <LoadingAnimation />
      </motion.div>
    );
  },
);

const ErrorContent = forwardRef<HTMLDivElement, { onClose: () => void }>(
  function ErrorContent({ onClose }, ref) {
    return (
      <div
        ref={ref}
        className="grid size-full place-content-center place-items-center gap-4 text-red-400"
      >
        <div className="flex flex-col items-center gap-2">
          <AlertCircleIcon size={50} />
          <p className="font-bold">タスクが存在しません</p>
          <p className="text-sm">
            このタスクはすでに削除されているか、URLが間違っている可能性があります。
            <br />
            ※このアプリでは、更新すると作成したすべてのタスクが削除されます。
          </p>
        </div>
        <Button onClick={onClose}>詳細ページを閉じる</Button>
      </div>
    );
  },
);
