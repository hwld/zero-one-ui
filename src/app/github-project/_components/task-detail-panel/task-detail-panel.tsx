import {
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useMemo, useRef } from "react";
import { appHeaderHeightPx } from "../app-header/app-header";
import { TaskDetailPanelContent } from "./panel-content";
import { useSearchParams } from "../../use-search-params";
import { HomeSearchParamsSchema, Routes } from "../../routes";
import { ResizablePanel } from "../resizable-panel";
import { Resizable, ResizeCallback } from "re-resizable";
import { TaskDetailPanelWidthStorage } from "../../_lib/task-detail-panel-width-storage";

const overlayClass = "detail-panel-overlay";

type Props = { isPinned: boolean; onTogglePin: () => void };

export const TaskDetailPanel: React.FC<Props> = ({ isPinned, onTogglePin }) => {
  const router = useRouter();
  const searchParams = useSearchParams(HomeSearchParamsSchema);

  const taskId = useMemo(() => {
    if (!searchParams.panel) {
      return undefined;
    }

    return searchParams.taskId;
  }, [searchParams]);

  const closePanel = () => {
    router.push(Routes.home({ viewId: searchParams.viewId }));
  };

  if (isPinned && taskId) {
    return (
      <ResizableTaskDetailPanel
        taskId={taskId}
        onClose={closePanel}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
      />
    );
  }

  return (
    <TaskDetailPanelDialog
      onTogglePin={onTogglePin}
      taskId={taskId}
      onClose={closePanel}
    />
  );
};

const ResizableTaskDetailPanel: React.FC<{
  taskId: string;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
}> = ({ taskId, onClose, isPinned, onTogglePin }) => {
  const resizableRef = useRef<Resizable>(null);

  const handleResize: ResizeCallback = (_, __, element) => {
    TaskDetailPanelWidthStorage.set(element.offsetWidth);
  };

  useLayoutEffect(() => {
    const width = TaskDetailPanelWidthStorage.get();
    if (width) {
      resizableRef.current?.updateSize({ width });
    }
  }, []);

  return (
    <ResizablePanel
      resizableRef={resizableRef}
      direction="left"
      minWidth={300}
      defaultSize={{ width: 700 }}
      onResizeStop={handleResize}
    >
      <TaskDetailPanelContent
        taskId={taskId}
        onClose={onClose}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
      />
    </ResizablePanel>
  );
};

const TaskDetailPanelDialog: React.FC<{
  onTogglePin: () => void;
  taskId: string | undefined;
  onClose: () => void;
}> = ({ onTogglePin, taskId, onClose }) => {
  const { refs, context } = useFloating({
    open: !!taskId,
    onOpenChange: (open) => {
      if (!open) {
        onClose();
      }
    },
  });

  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      const target = event.target;

      if (target instanceof Element) {
        return !!target.closest(`.${overlayClass}`);
      }

      return false;
    },
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {taskId && (
          <FloatingOverlay
            className={`${overlayClass}`}
            style={{
              top: "var(--header-height)",
              ["--header-height" as string]: appHeaderHeightPx,
              colorScheme: "dark",
            }}
          >
            <motion.div
              className="fixed inset-0 top-(--header-height) bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div ref={refs.setFloating} {...getFloatingProps()}>
                <motion.div
                  className="fixed inset-y-0 top-(--header-height) right-0 w-full max-w-[1100px] rounded-l-md border border-neutral-600 bg-neutral-900 text-neutral-100 shadow-sm"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <TaskDetailPanelContent
                    taskId={taskId}
                    onClose={onClose}
                    isPinned={false}
                    onTogglePin={onTogglePin}
                  />
                </motion.div>
              </div>
            </motion.div>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};
