import {
  Dialog,
  DialogAction,
  DialogContent,
  DialogTitle,
} from "../../_components/dialog";
import { CreateEventInput } from "../../_backend/api";
import { useCreateEvent } from "./use-create-event";
import { EVENT_FORM_ID, EventForm } from "./event-form";
import { DragDateRange } from "../../utils";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../../_components/button";

type Props = {
  isOpen: boolean;
  defaultFormValues: CreateEventInput | undefined;
  onChangeEventPeriodPreview: Dispatch<
    SetStateAction<DragDateRange | undefined>
  >;
  onClose: () => void;
};
export const CreateEventFormDialog: React.FC<Props> = ({
  isOpen,
  defaultFormValues,
  onChangeEventPeriodPreview,
  onClose,
}) => {
  const createEventMutation = useCreateEvent();

  const handleChangeOpen = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleCreateEvent = (input: CreateEventInput) => {
    createEventMutation.mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog isOpen={isOpen} onChangeOpen={handleChangeOpen}>
      <DialogContent>
        <DialogTitle onClose={onClose}>イベント作成</DialogTitle>
        {defaultFormValues !== undefined && (
          <EventForm
            defaultValues={defaultFormValues}
            onSubmit={handleCreateEvent}
            onChangeEventPeriodPreview={onChangeEventPeriodPreview}
            isPending={createEventMutation.isPending}
          />
        )}
        <DialogAction>
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            type="submit"
            form={EVENT_FORM_ID}
            isPending={createEventMutation.isPending}
          >
            作成する
          </Button>
        </DialogAction>
      </DialogContent>
    </Dialog>
  );
};
