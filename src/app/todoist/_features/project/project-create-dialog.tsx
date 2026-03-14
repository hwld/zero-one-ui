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
import { Separator } from "../../_components/separator";
import { Button } from "../../_components/button";
import { ProjectForm } from "./project-form";
import { useCreateProject } from "./use-create-project";
import { useId } from "react";
import { CreateProjectInput, ProjectFormData } from "../../_backend/taskbox/project/schema";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
} & ({ createType: "default" } | { createType: "before" | "after"; referenceProjectId: string });

export const ProjectCreateDialog: React.FC<Props> = (props) => {
  const { isOpen, onOpenChange } = props;
  const formId = useId();
  const createProject = useCreateProject();

  const handleCreateProject = (data: ProjectFormData) => {
    let input: CreateProjectInput;
    if (props.createType === "default") {
      input = { ...data, type: "default" };
    } else {
      input = {
        ...data,
        type: props.createType,
        referenceProjectId: props.referenceProjectId,
      };
    }

    createProject.mutate(input, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader withClose>
        <div className="flex grow items-center gap-2">
          <DialogTitle>プロジェクトを追加</DialogTitle>
          <IconButton icon={PiQuestionLight} />
        </div>
      </DialogHeader>
      <Separator />
      <DialogContent>
        <ProjectForm id={formId} onSubmit={handleCreateProject} />
      </DialogContent>
      <Separator />
      <DialogFooter>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">キャンセル</Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={createProject.isPending}>
            追加
          </Button>
        </DialogActions>
      </DialogFooter>
    </Dialog>
  );
};
