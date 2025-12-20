import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsQueryOption } from "./use-events";
import { useToast } from "../../_components/toast";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useState,
  useContext,
} from "react";
import { deleteEvent } from "../../_backend/api";

type _Context = [
  pendingDeleteEventIds: string[],
  setPendingDeleteEvents: Dispatch<SetStateAction<string[]>>,
];
const _Context = createContext<_Context | undefined>(undefined);

const usePendingDeleteEventsInternal = () => {
  const ctx = useContext(_Context);
  if (!ctx) {
    throw new Error("DeleteEventProviderが存在しません");
  }

  return ctx;
};

export const usePendingDeleteEvents = (): {
  pendingDeleteEventIds: _Context[0];
} => {
  const ctx = usePendingDeleteEventsInternal();
  return { pendingDeleteEventIds: ctx[0] };
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [_, setPendingDeleteEventIds] = usePendingDeleteEventsInternal();

  const { mutate: deleteEventMutate } = useMutation({
    mutationFn: (id: string) => {
      return deleteEvent(id);
    },
    onError: () => {
      toast.error({
        title: "イベントの作成に失敗しました",
        description: "もう一度試しても失敗する場合、画面を更新してみてください",
        actionText: "画面を更新",
        action: () => {
          window.location.reload();
        },
      });
    },
    onSettled: async (_, __, id) => {
      await queryClient.refetchQueries({
        queryKey: eventsQueryOption.queryKey,
      });
      setPendingDeleteEventIds((pendingIds) =>
        pendingIds.filter((pendingId) => pendingId !== id),
      );
    },
  });

  return useCallback(
    async (id: string) => {
      const queryKey = eventsQueryOption.queryKey;
      await queryClient.cancelQueries({ queryKey });

      const deletedEvent = queryClient
        .getQueryData(eventsQueryOption.queryKey)
        ?.find((e) => e.id === id);

      if (!deletedEvent) {
        return;
      }

      setPendingDeleteEventIds((pendingIds) => [
        ...pendingIds.filter((pendingId) => pendingId !== deletedEvent.id),
        deletedEvent.id,
      ]);

      toast.info({
        title: "イベントを削除しました",
        actionText: "元に戻す",
        action: ({ close }) => {
          setPendingDeleteEventIds((pendingIds) =>
            pendingIds.filter((pendingId) => pendingId !== deletedEvent.id),
          );
          close({ withoutCallback: true });
        },
        onClose: () => {
          deleteEventMutate(id);
        },
      });
    },
    [deleteEventMutate, queryClient, setPendingDeleteEventIds, toast],
  );
};

export const DeleteEventProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const pendingDeleteState = useState<string[]>([]);

  return (
    <_Context.Provider value={pendingDeleteState}>{children}</_Context.Provider>
  );
};
