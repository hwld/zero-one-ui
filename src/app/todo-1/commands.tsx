import { useQueryClient } from "@tanstack/react-query";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import { useMemo } from "react";
import { DatabaseIcon, DatabaseZapIcon } from "lucide-react";
import { resetTodo1Data } from "./_backend/db/reset";
import { resetAllData } from "../../lib/db/reset";

export const useTodo1HomeCommands = () => {
  const client = useQueryClient();

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: DatabaseIcon,
            label: "データをリセット",
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
    }, [client]),
  );
};
