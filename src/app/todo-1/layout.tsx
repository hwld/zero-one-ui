"use client";

import clsx from "clsx";
import { PropsWithChildren, Suspense, useEffect, useRef } from "react";
import { SideBar } from "./_components/side-bar/side-bar";
import { HomeIcon } from "lucide-react";
import { TaskCreateInput } from "./_components/task-create-input";
import { Menu } from "./_components/menu/menu";
import { useTodo1HomeCommands } from "./commands";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";
import { TaskListContent } from "./_components/task-list-content";
import { useTasks } from "./_queries/use-tasks";
import { useBodyBgColor } from "../../lib/useBodyBgColor";
import { Toaster } from "sonner";

// Static ExportでParallel Routesが動かないっぽいので、page.tsxにnullを返させて
// layoutでページをレンダリングする

const LayoutInner: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: tasks = [], status: tasksStatus } = useTasks();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useTodo1HomeCommands();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const cmdK = e.metaKey && e.key === "k";
      const ctrlK = e.ctrlKey && e.key === "k";
      if (cmdK || ctrlK) {
        e.stopPropagation();
        e.preventDefault();
        focusInput();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const bgColor = "bg-neutral-100";
  useBodyBgColor(bgColor);

  return (
    <div className={clsx("flex h-dvh text-neutral-700", bgColor)}>
      <SideBar />
      <div
        className="flex grow flex-col items-center overflow-auto px-2 pt-10"
        style={{ backgroundImage: "url(/1-bg.svg)", backgroundSize: "200px" }}
      >
        <div className="size-full max-w-3xl shrink-0">
          <div className="relative flex flex-col gap-4 pb-24">
            <h1 className="flex items-center gap-2 font-bold text-neutral-700">
              <HomeIcon strokeWidth={3} size={20} />
              <div className="pt-[3px]">今日のタスク</div>
            </h1>
            <TaskListContent tasks={tasks} status={tasksStatus} />
          </div>
        </div>
        <div className="absolute bottom-0 flex max-w-[95%] items-start gap-2 py-5">
          <TaskCreateInput ref={inputRef} />
          <div className="shrink-0">
            <Menu />
          </div>
        </div>
      </div>
      <Suspense>{children}</Suspense>
    </div>
  );
};

const Layout: React.FC<LayoutProps<"/todo-1">> = ({ children }) => {
  return (
    <DefaultQueryClientProvider>
      <LayoutInner>{children}</LayoutInner>
      <Toaster expand gap={8} duration={3000} />
    </DefaultQueryClientProvider>
  );
};

export default Layout;
