import { ReactNode, useId, useState } from "react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { ViewForm } from "./view-form";
import { useCreateView } from "../_queries/use-create-view";
import { CreateViewInput } from "../_backend/view/api";

type Props = { children: ReactNode };

export const ViewCreateDialogTrigger: React.FC<Props> = ({ children }) => {
  const createViewMutation = useCreateView();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (input: CreateViewInput) => {
    createViewMutation.mutate(input, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  const formId = useId();
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Create view"
      trigger={children}
      action={
        <>
          <Button size="lg" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="lg" color="primary" form={formId} disabled={createViewMutation.isPending}>
            Create
          </Button>
        </>
      }
    >
      <ViewForm id={formId} onSubmit={handleSubmit} />
    </Dialog>
  );
};
