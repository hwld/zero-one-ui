import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../_backend/api";
import { usePendingDeleteEvents } from "./use-delete-event";
import { useMswState } from "../../../_providers/msw-provider";

export const eventsQueryOption = queryOptions({
  queryKey: ["events"],
  queryFn: () => {
    return fetchEvents();
  },
});

export const useEvents = () => {
  const { pendingDeleteEventIds } = usePendingDeleteEvents();
  const { isMockserverUp } = useMswState();

  const { data: events = [] } = useQuery({
    ...eventsQueryOption,
    enabled: isMockserverUp,
  });

  const filteredEvents = events.filter(
    (e) => !pendingDeleteEventIds.includes(e.id),
  );

  return { events: filteredEvents };
};
