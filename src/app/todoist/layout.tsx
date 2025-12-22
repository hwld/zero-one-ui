"use client";
import { ReactNode, Suspense } from "react";
import { Sidebar } from "./_components/sidebar/sidebar";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";
import { SidebarContextProvider } from "./_components/sidebar/provider";
import { GlobalDataProvider } from "./_components/global-data-provider";
import { appHeaderHeightName } from "./lib";

const Layout: React.FC<LayoutProps<"/todoist">> = ({ children }) => {
  return (
    <DefaultQueryClientProvider>
      <GlobalDataProvider>
        <SidebarContextProvider>
          <div
            className="flex h-dvh bg-stone-50 text-sm text-neutral-900"
            style={{ [appHeaderHeightName as string]: "56px" }}
          >
            <Suspense>
              <Sidebar />
              <div className="w-full overflow-hidden">{children}</div>
            </Suspense>
          </div>
        </SidebarContextProvider>
      </GlobalDataProvider>
    </DefaultQueryClientProvider>
  );
};

export default Layout;
