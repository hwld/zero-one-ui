"use client";

import { Suspense, type PropsWithChildren } from "react";
import { useScrollableRoot } from "./_providers/scrollable-root-provider";
import { ScrollableRootProvider } from "./_providers/scrollable-root-provider";
import clsx from "clsx";
import { Sidebar } from "./_components/side-bar/side-bar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";
import { TaskTableProvider } from "./_components/task-table/provider";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { scrollableRootRef } = useScrollableRoot();

  const bgClass = "bg-zinc-900";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-screen gap-6 overflow-hidden text-zinc-200",
        bgClass,
      )}
      style={{ colorScheme: "dark" }}
    >
      <div className="sticky top-0 py-6 pl-6">
        <Sidebar />
      </div>
      <div
        ref={scrollableRootRef}
        className="flex w-full flex-col gap-4 overflow-auto py-6 pr-6"
      >
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
};

const LayoutWithProviders: React.FC<LayoutProps<"/todo-2">> = ({
  children,
}) => {
  return (
    <DefaultQueryClientProvider>
      <ScrollableRootProvider>
        <TaskTableProvider>
          <Layout>{children}</Layout>
        </TaskTableProvider>
      </ScrollableRootProvider>
    </DefaultQueryClientProvider>
  );
};

export default LayoutWithProviders;
