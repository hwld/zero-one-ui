import { Dialog, DialogAction, DialogContent, DialogTitle } from "../../_components/dialog";
import { useUpdateEvent } from "./use-update-event";
import { UpdateEventInput } from "../../_backend/api";
import { EVENT_FORM_ID, EventForm } from "./event-form";
import { Button } from "../../_components/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  defaultFormValues: UpdateEventInput;
  eventId: string;
};

export const UpdateEventFormDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultFormValues,
  eventId,
}) => {
  const updateEventMutation = useUpdateEvent();

  const handleChangeOpen = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleUpdateEvent = (input: UpdateEventInput) => {
    updateEventMutation.mutate(
      { ...input, id: eventId },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog isOpen={isOpen} onChangeOpen={handleChangeOpen}>
      <DialogContent>
        <DialogTitle onClose={onClose}>イベント更新</DialogTitle>
        <EventForm
          defaultValues={defaultFormValues}
          onSubmit={handleUpdateEvent}
          isPending={updateEventMutation.isPending}
        />
        <DialogAction>
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button type="submit" form={EVENT_FORM_ID} isPending={updateEventMutation.isPending}>
            更新する
          </Button>
        </DialogAction>
      </DialogContent>
    </Dialog>
  );
};
