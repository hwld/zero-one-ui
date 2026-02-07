"use client";
import { ReactNode } from "react";
import { GlobalCommandProvider } from "./global-command/global-command-provider";
import { PGliteProvider } from "./pglite-provider";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <PGliteProvider>
      <GlobalCommandProvider>{children}</GlobalCommandProvider>
    </PGliteProvider>
  );
};
