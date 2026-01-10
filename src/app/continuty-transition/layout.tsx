import { Suspense } from "react";

const Layout: React.FC<LayoutProps<"/continuty-transition">> = ({
  children,
}) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
