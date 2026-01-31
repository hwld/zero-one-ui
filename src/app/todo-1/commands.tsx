import { useQueryClient } from "@tanstack/react-query";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import { useEffect, useMemo, useState } from "react";
import {
  BoxSelectIcon,
  DatabaseZapIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { resetTodo1Data } from "./_backend/db/reset";
import { resetAllData } from "../../lib/db/reset";
import { errorSimulator } from "./_backend/error-simulator";
import { todo1TaskRepository } from "./_backend/db/repository";

export const useTodo1HomeCommands = () => {
  const client = useQueryClient();
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isSimulatingError ? TriangleIcon : TriangleAlertIcon,
            label: `エラーを${isSimulatingError ? "止める" : "発生させる"}`,
            action: async () => {
              setIsSimulatingError((s) => !s);
              if (isSimulatingError) {
                errorSimulator.stop();
              } else {
                errorSimulator.start();
              }
              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスク一覧を空にする",
            action: async () => {
              await todo1TaskRepository.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスク一覧を初期化する",
            action: async () => {
              await resetTodo1Data();
              client.refetchQueries();
            },
          },
          {
            icon: DatabaseZapIcon,
            label: "全プロジェクトのデータをリセット",
            action: async () => {
              await resetAllData();
              window.location.reload();
            },
          },
        ],
      };
    }, [client, isSimulatingError]),
  );

  useEffect(() => {
    errorSimulator.stop();
    return () => {
      errorSimulator.stop();
    };
  }, []);
};
