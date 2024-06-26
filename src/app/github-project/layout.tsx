"use client";
import { PropsWithChildren } from "react";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <DefaultQueryClientProvider>{children}</DefaultQueryClientProvider>;
};

export default Layout;
