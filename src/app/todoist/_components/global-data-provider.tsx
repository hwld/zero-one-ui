import { useMemo, type PropsWithChildren } from "react";
import { useQueryTaskboxNodes } from "../_features/taskbox/use-query-taskbox-nodes";
import { TaskboxNodesProvider } from "../_features/taskbox/taskbox-nodes-provider";
import { PiSpinnerGap } from "@react-icons/all-files/pi/PiSpinnerGap";
import { useProjectsQuery } from "../_features/project/use-projects-query";
import { AnimatePresence, motion } from "motion/react";
import {
  ProjectsProvider,
  type ProjectsContext,
} from "../_features/project/use-projects";
import { Button } from "./button";
import { useInbox } from "../_features/inbox/use-inbox";

export const GlobalDataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  // prefetch
  useInbox();

  const { data: taskboxNodes, status: taskboxNodesStatus } =
    useQueryTaskboxNodes();

  const {
    data: projects = [],
    updateProjectsCache,
    status: projectsStatus,
  } = useProjectsQuery();

  const projectsValue = useMemo(
    (): ProjectsContext => ({ projects, updateProjectsCache }),
    [projects, updateProjectsCache],
  );

  const loading =
    taskboxNodesStatus === "pending" || projectsStatus === "pending";

  const error = taskboxNodesStatus === "error" || projectsStatus === "error";

  const data = !!taskboxNodes && !!projectsStatus;

  if (error) {
    return (
      <div className="fixed inset-0 grid place-content-center gap-2 text-sm">
        <div>
          <p>エラーが発生しました。</p>
          <p>更新してもう一度試してみてください。</p>
        </div>
        <div className="self-start">
          <Button
            onClick={() => {
              window.location.reload();
            }}
          >
            更新する
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {loading ? (
          <motion.div
            className="fixed inset-0 grid size-full place-items-center"
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <PiSpinnerGap className="size-10 animate-spin" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {data ? (
        <ProjectsProvider value={projectsValue}>
          <TaskboxNodesProvider taskboxNodes={taskboxNodes}>
            {children}
          </TaskboxNodesProvider>
        </ProjectsProvider>
      ) : null}
    </>
  );
};
