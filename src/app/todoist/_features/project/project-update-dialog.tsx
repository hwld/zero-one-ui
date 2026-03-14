import { PiQuestionLight } from "@react-icons/all-files/pi/PiQuestionLight";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../_components/dialog";
import { IconButton } from "../../_components/icon-button";
import { ProjectNode } from "./logic/project";
import { Separator } from "../../_components/separator";
import { Button } from "../../_components/button";
import { ProjectForm } from "./project-form";
import { useId } from "react";
import { useUpdateProject } from "./use-update-project";
import { ProjectFormData } from "../../_backend/taskbox/project/schema";

type Props = {
  project: ProjectNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectUpdateDialog: React.FC<Props> = ({ project, isOpen, onOpenChange }) => {
  const formId = useId();
  const updateProject = useUpdateProject();

  const handleUpdateProject = (data: ProjectFormData) => {
    updateProject.mutate(
      { ...data, id: project.taskboxId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader withClose>
        <div className="flex grow items-center gap-2">
          <DialogTitle>編集</DialogTitle>
          <IconButton icon={PiQuestionLight} />
        </div>
      </DialogHeader>
      <Separator />
      <DialogContent>
        <ProjectForm
          id={formId}
          onSubmit={handleUpdateProject}
          defaultValues={{ label: project.label }}
        />
      </DialogContent>
      <Separator />
      <DialogFooter>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">キャンセル</Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={updateProject.isPending}>
            保存
          </Button>
        </DialogActions>
      </DialogFooter>
    </Dialog>
  );
};
