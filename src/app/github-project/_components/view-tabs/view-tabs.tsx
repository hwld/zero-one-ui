"use client";
import { PlusIcon } from "lucide-react";
import React, { ReactNode } from "react";
import { ViewTabButton, ViewTabLink } from "../view-tab";
import { useViewSummaries } from "../../_queries/use-view-summaries";
import { ViewCreateDialogTrigger } from "../view-create-dialog";
import { HomeSearchParamsSchema, Routes } from "../../routes";
import { useSearchParams } from "../../use-search-params";
import { ErrorContent } from "./error-content";
import { LoadingContent } from "./loading-content";
import { NoViewContent } from "./no-view-content";
import { ViewContent } from "./view-content";

const TabsLayout: React.FC<{ tabs?: ReactNode; children: ReactNode }> = ({ tabs, children }) => {
  return (
    <div className="grid min-h-0 grid-rows-[min-content_minmax(0,1fr)]">
      <div className="flex w-full items-stretch overflow-x-auto border-b border-neutral-600 px-8">
        <div className="flex h-[42px] items-stretch">{tabs}</div>
      </div>
      <div className="relative flex overflow-auto bg-neutral-800">{children}</div>
    </div>
  );
};

export const ViewTabs: React.FC = () => {
  const searchParams = useSearchParams(HomeSearchParamsSchema);

  const { data: viewSummaries, status: viewSummariesStatus } = useViewSummaries();

  if (viewSummariesStatus === "error") {
    return (
      <TabsLayout>
        <ErrorContent />
      </TabsLayout>
    );
  }

  if (viewSummariesStatus === "pending") {
    return (
      <TabsLayout>
        <LoadingContent />
      </TabsLayout>
    );
  }

  const firstViewId = viewSummaries.at(0)?.id;
  const viewId = searchParams.viewId ?? firstViewId;

  return (
    <TabsLayout
      tabs={
        <>
          {viewSummaries.map((summary) => {
            return (
              <ViewTabLink
                viewSummary={summary}
                href={Routes.home({ ...searchParams, viewId: summary.id })}
                key={summary.id}
                active={viewId === summary.id}
              >
                {summary.name}
              </ViewTabLink>
            );
          })}
          <ViewCreateDialogTrigger>
            <ViewTabButton icon={PlusIcon}>New view</ViewTabButton>
          </ViewCreateDialogTrigger>
        </>
      }
    >
      {viewId ? <ViewContent key={viewId} viewId={viewId} /> : <NoViewContent />}
    </TabsLayout>
  );
};
