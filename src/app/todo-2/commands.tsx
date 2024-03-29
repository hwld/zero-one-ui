import { useMemo, useState } from "react";
import { useGlobalCommandConfig } from "../_providers/global-command-provider";
import {
  BoxSelectIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { taskStore } from "./_mocks/task-store";
import { useQueryClient } from "@tanstack/react-query";

export const useTodo2HomeCommands = () => {
  const client = useQueryClient();
  const [isErrorMode, setIsErrorMode] = useState(false);

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isErrorMode ? TriangleIcon : TriangleAlertIcon,
            label: isErrorMode
              ? "タスク取得エラーを止める"
              : "タスク取得エラーを発生させる",
            action: async () => {
              // TODO:
              // tsakStoreはグローバルなので、このhookを使っているコンポーネントがアンマウントされると
              // 状態が食い違う
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                taskStore.stopSimulateError();
              } else {
                taskStore.simulateError();
              }
              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスク一覧を空にする",
            action: async () => {
              taskStore.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスク一覧を初期化する",
            action: async () => {
              taskStore.reset();
              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );
};
