import { Dialog } from "./dialog";
import { ReactNode, useState } from "react";
import { Button } from "./button";

type Props = {
  children: ReactNode;
  onDelete: () => void;
  isDeleting: boolean;
};

export const ViewDeleteConfirmDialogTrigger: React.FC<Props> = ({
  children,
  onDelete,
  isDeleting,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Delete view?"
      trigger={children}
      action={
        <>
          <Button size="lg" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="lg" color="destructive" onClick={onDelete} disabled={isDeleting}>
            Delete
          </Button>
        </>
      }
    >
      <div className="text-sm text-neutral-300">
        Are you sure you want to delete this item from this project?
      </div>
    </Dialog>
  );
};
