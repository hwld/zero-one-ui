import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDragProjectContext } from "./use-drag";
import { ProjectExpansionMap } from "../logic/expansion-map";
import { toProjectNodes } from "../logic/project";
import { ProjectNavItem } from "./item";
import { ProjectNavListHeader } from "./header";
import { Routes } from "../../../routes";
import { useProjects } from "../use-projects";

type Props = {
  currentRoute: string;
};

export const ProjectNavList: React.FC<Props> = ({ currentRoute }) => {
  const [isOpen, setIsOpen] = useState(true);

  const { projects, updateProjectsCache } = useProjects();

  const [projectExpansionMap, setProjectExpansionMap] = useState(
    new ProjectExpansionMap(),
  );

  const projectNodes = toProjectNodes(projects, projectExpansionMap);

  const dragContext = useDragProjectContext({
    projectExpansionMap,
    setProjectExpansionMap,
    updateProjectsCache,
  });

  const handleChangeExpanded = (projectId: string, newExpanded: boolean) => {
    setProjectExpansionMap((m) => {
      return new ProjectExpansionMap(m).toggle(projectId, newExpanded);
    });
  };

  return (
    <div>
      <ProjectNavListHeader
        active={currentRoute === Routes.projectList()}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        projectsCount={projects.length}
      />

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            {projectNodes.map((projectNode) => {
              return (
                <AnimatePresence key={projectNode.taskboxId} initial={false}>
                  {projectNode.visible ||
                  dragContext.draggingProjectId === projectNode.taskboxId ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <ProjectNavItem
                        dragContext={dragContext}
                        currentRoute={currentRoute}
                        project={projectNode}
                        expanded={projectExpansionMap.isExpanded(
                          projectNode.taskboxId,
                        )}
                        onChangeExpanded={handleChangeExpanded}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
