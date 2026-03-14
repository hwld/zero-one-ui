import { ReactNode, useId, useState } from "react";
import { useUpdateView } from "../_queries/use-update-view";
import { Dialog } from "./dialog";
import { ViewForm } from "./view-form";
import { ViewFormData, ViewSummary } from "../_backend/view/api";
import { Button } from "./button";

type Props = { children: ReactNode; viewSummary: ViewSummary };

export const ViewUpdateDialogTrigger: React.FC<Props> = ({ children, viewSummary }) => {
  const updateViewMutation = useUpdateView();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (input: ViewFormData) => {
    updateViewMutation.mutate(
      { id: viewSummary.id, ...input },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  const formId = useId();
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Update view"
      trigger={children}
      action={
        <>
          <Button size="lg" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="lg" color="primary" form={formId} disabled={updateViewMutation.isPending}>
            Create
          </Button>
        </>
      }
    >
      <ViewForm id={formId} defaultValues={{ name: viewSummary.name }} onSubmit={handleSubmit} />
    </Dialog>
  );
};
