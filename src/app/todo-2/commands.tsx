import { useEffect, useMemo, useState } from "react";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import {
  BoxSelectIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { todo2TaskRepository } from "./_backend/db/repository";
import { resetTodo2Data } from "./_backend/db/reset";
import { todo2ErrorSimulator } from "./_backend/error-simulator";

export const useTodo2HomeCommands = () => {
  const client = useQueryClient();
  const [isErrorMode, setIsErrorMode] = useState(false);

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isErrorMode ? TriangleIcon : TriangleAlertIcon,
            label: `タスク取得エラーを${isErrorMode ? "止める" : "発生させる"}`,
            action: async () => {
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                todo2ErrorSimulator.removeErrorSimulationScope("getAll");
              } else {
                todo2ErrorSimulator.addErrorSimulationScope("getAll");
              }

              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスク一覧を空にする",
            action: async () => {
              await todo2TaskRepository.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスク一覧を初期化する",
            action: async () => {
              await resetTodo2Data();
              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );

  useEffect(() => {
    todo2ErrorSimulator.stopErrorSimulation();
    return () => {
      todo2ErrorSimulator.stopErrorSimulation();
    };
  }, []);
};

export const useTodo2DetailCommands = () => {
  const client = useQueryClient();
  const [isErrorMode, setIsErrorMode] = useState(false);
  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isErrorMode ? TriangleIcon : TriangleAlertIcon,
            label: `タスク取得エラーを${isErrorMode ? "止める" : "発生させる"}`,
            action: async () => {
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                todo2ErrorSimulator.removeErrorSimulationScope("get");
              } else {
                todo2ErrorSimulator.addErrorSimulationScope("get");
              }

              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );

  useEffect(() => {
    todo2ErrorSimulator.stopErrorSimulation();
    return () => {
      todo2ErrorSimulator.stopErrorSimulation();
    };
  }, []);
};
