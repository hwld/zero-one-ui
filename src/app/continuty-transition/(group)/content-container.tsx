import { ReactNode } from "react";

export const ContentContainer: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-wrap gap-4">{children}</div>;
};
