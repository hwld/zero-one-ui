"use client";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

const Layout: React.FC<LayoutProps<"/github-project">> = ({ children }) => {
  return <DefaultQueryClientProvider>{children}</DefaultQueryClientProvider>;
};

export default Layout;
