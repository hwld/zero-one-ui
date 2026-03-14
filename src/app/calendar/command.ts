import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { EventStoreErrorSimulationScope, eventStore } from "./_backend/event-store";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import { TriangleAlertIcon, TriangleIcon } from "lucide-react";

export const useCalendarCommands = () => {
  const client = useQueryClient();
  const [errorSimulationScope, setErrorSimulationScope] = useState<
    Record<EventStoreErrorSimulationScope, boolean>
  >({
    query: false,
    mutation: false,
  });

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: errorSimulationScope.query ? TriangleIcon : TriangleAlertIcon,
            label: `イベント取得エラーを${errorSimulationScope.query ? "止める" : "発生させる"}`,
            action: () => {
              setErrorSimulationScope((s) => ({ ...s, query: !s.query }));
              eventStore.setErrorSimulationScope("query", !errorSimulationScope.query);

              void client.refetchQueries();
            },
          },
          {
            icon: errorSimulationScope.mutation ? TriangleIcon : TriangleAlertIcon,
            label: `イベント更新エラーを${errorSimulationScope.mutation ? "止める" : "発生させる"}`,
            action: () => {
              setErrorSimulationScope((s) => ({ ...s, mutation: !s.mutation }));
              eventStore.setErrorSimulationScope("mutation", !errorSimulationScope.mutation);

              void client.refetchQueries();
            },
          },
        ],
      };
    }, [client, errorSimulationScope.mutation, errorSimulationScope.query]),
  );

  useEffect(() => {
    eventStore.stopErrorSimulation();
    return () => {
      eventStore.stopErrorSimulation();
    };
  }, []);
};
