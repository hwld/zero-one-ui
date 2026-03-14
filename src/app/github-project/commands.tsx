import { useEffect, useMemo, useState } from "react";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import { TriangleAlertIcon, TriangleIcon } from "lucide-react";
import { taskStore } from "./_backend/task/store";
import { useQueryClient } from "@tanstack/react-query";

export const useGitHubProjectCommands = () => {
  const client = useQueryClient();
  const [errorSimulationScope, setErrorSimulationScope] = useState({
    query: false,
    mutation: false,
  });

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: errorSimulationScope.query ? TriangleIcon : TriangleAlertIcon,
            label: `タスク取得エラーを${errorSimulationScope.query ? "止める" : "発生させる"}`,
            action: async () => {
              setErrorSimulationScope((s) => ({ ...s, query: !s.query }));

              if (errorSimulationScope.query) {
                taskStore.removeErrorSimulationScope("getAll");
              } else {
                taskStore.addErrorSimulationScope("getAll");
              }

              void client.refetchQueries();
            },
          },
          {
            icon: errorSimulationScope.mutation ? TriangleIcon : TriangleAlertIcon,
            label: `タスク更新系のエラーを${
              errorSimulationScope.mutation ? "止める" : "発生させる"
            }`,
            action: async () => {
              setErrorSimulationScope((s) => ({ ...s, mutation: !s.mutation }));

              if (errorSimulationScope.mutation) {
                taskStore.removeErrorSimulationScope("mutation");
              } else {
                taskStore.addErrorSimulationScope("mutation");
              }

              void client.refetchQueries();
            },
          },
        ],
      };
    }, [client, errorSimulationScope.mutation, errorSimulationScope.query]),
  );

  useEffect(() => {
    taskStore.stopErrorSimulation();
    return () => {
      taskStore.stopErrorSimulation();
    };
  }, []);
};
