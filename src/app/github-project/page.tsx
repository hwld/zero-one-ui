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
import { ViewTabsPage } from "./view-tabs-page";
import { useGitHubProjectCommands } from "./commands";
import { useBodyBgColor } from "@/lib/useBodyBgColor";
import clsx from "clsx";

const GitHubProjectPage: React.FC = () => {
  const bgColor = "bg-neutral-900";
  useBodyBgColor(bgColor);

  useGitHubProjectCommands();

  return (
    <>
      <div
        className={clsx(
          "grid h-[100dvh] w-[100dvw] grid-rows-[var(--header-height)_48px_minmax(0,1fr)] overflow-hidden text-neutral-100",
          bgColor,
        )}
        style={{
          colorScheme: "dark",
          ["--header-height" as string]: appHeaderHeightPx,
        }}
      >
        <AppHeader />
        <div className="flex items-center justify-between px-8">
          <div className="text-lg font-bold">zero-one-ui</div>
          <div className="flex items-center gap-2">
            <button className="h-5 rounded-full bg-neutral-700 px-2 text-xs font-bold text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200">
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
                <ButtonGroupItem position="right" icon={MoreHorizontalIcon} />
              </ProjectMenuTrigger>
            </div>
          </div>
        </div>
        <Suspense>
          <ViewTabsPage />
        </Suspense>
      </div>
      <Toaster />
    </>
  );
};
export default GitHubProjectPage;
