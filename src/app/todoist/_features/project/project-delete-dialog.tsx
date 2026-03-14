import { useMemo } from "react";
import { Button } from "../../_components/button";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../_components/dialog";
import { ProjectNode } from "./logic/project";
import { useDeleteProject } from "./use-delete-project";

type Props = {
  project: ProjectNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectDeleteDialog: React.FC<Props> = ({ project, isOpen, onOpenChange }) => {
  const deleteProject = useDeleteProject();

  const handleDelete = () => {
    deleteProject.mutate(project.taskboxId);
  };

  const description = useMemo(() => {
    const projectName = <span className="font-bold">「{project.label}」</span>;

    if (project.descendantsProjectCount > 0) {
      return (
        <>
          {projectName}とその{project.descendantsProjectCount}
          件のサブプロジェクトとそのすべてのタスクは永久に削除されます。これを取り消すことはできません。
        </>
      );
    } else {
      return (
        <>
          {projectName}
          とそのタスクは永久に削除されます。これを取り消すことはできません。
        </>
      );
    }
  }, [project.label, project.descendantsProjectCount]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>削除しますか？</DialogTitle>
      </DialogHeader>
      <DialogContent>{description}</DialogContent>
      <DialogFooter>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">キャンセル</Button>
          </DialogClose>
          <Button onClick={handleDelete} disabled={deleteProject.isPending}>
            削除
          </Button>
        </DialogActions>
      </DialogFooter>
    </Dialog>
  );
};
