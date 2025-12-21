"use client";
import {
  LineChartIcon,
  MoreHorizontalIcon,
  PanelRightOpenIcon,
} from "lucide-react";
import React, { Suspense } from "react";
import { Tooltip } from "./_components/tooltip";
import {
  AppHeader,
  appHeaderHeightPx,
} from "./_components/app-header/app-header";
import { ButtonGroupItem } from "./_components/button-group-item";
import { ProjectMenuTrigger } from "./_components/project-menu-trigger";
import { Toaster } from "./_components/toast/toaster";
import { ViewTabs } from "./_components/view-tabs/view-tabs";
import { useGitHubProjectCommands } from "./commands";
import clsx from "clsx";
import { TaskDetailPanel } from "./_components/task-detail-panel/task-detail-panel";
import { BG_COLOR_CLASS } from "./consts";
import { useLocalStorage } from "@mantine/hooks";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const GitHubProjectPage: React.FC = () => {
  const [isDetailPinned, setIsDetailPinned] = useLocalStorage({
    key: "is-detail-pinned",
    defaultValue: false,
  });

  const handleTogglePin = () => {
    // setIsDetailPinned(s => !s) を使うと、複数回呼ばれて(?)期待しない値になる
    setIsDetailPinned(!isDetailPinned);
  };

  useBodyBgColor(BG_COLOR_CLASS);
  useGitHubProjectCommands();

  return (
    <>
      <div
        className={clsx(
          "grid h-dvh w-dvw grid-cols-1 grid-rows-[var(--header-height)_minmax(0,1fr)] overflow-hidden text-neutral-100",
          BG_COLOR_CLASS,
        )}
        style={{
          colorScheme: "dark",
          ["--header-height" as string]: appHeaderHeightPx,
        }}
      >
        <AppHeader />
        <div className="flex w-full">
          <div className="grid size-full grid-cols-1 grid-rows-[min-content_1fr] overflow-auto">
            <div className="flex h-[48px] w-full items-center justify-between gap-4 px-8">
              <div className="text-lg font-bold text-nowrap">zero-one-ui</div>
              <div className="flex items-center gap-2">
                <button className="h-5 rounded-full bg-neutral-700 px-2 text-xs font-bold text-nowrap text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
                  Add status update
                </button>
                <div className="flex items-center">
                  <Tooltip label="Insight">
                    <ButtonGroupItem position="left" icon={LineChartIcon} />
                  </Tooltip>
                  <Tooltip label="Project details">
                    <ButtonGroupItem icon={PanelRightOpenIcon} />
                  </Tooltip>
                  <ProjectMenuTrigger>
                    <ButtonGroupItem
                      position="right"
                      icon={MoreHorizontalIcon}
                    />
                  </ProjectMenuTrigger>
                </div>
              </div>
            </div>
            <Suspense>
              <ViewTabs />
            </Suspense>
          </div>
          <Suspense>
            <TaskDetailPanel
              isPinned={isDetailPinned}
              onTogglePin={handleTogglePin}
            />
          </Suspense>
        </div>
      </div>
      <Toaster />
    </>
  );
};
export default GitHubProjectPage;
