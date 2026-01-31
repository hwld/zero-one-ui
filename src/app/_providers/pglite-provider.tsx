"use client";

import { useEffect } from "react";
import { pgliteManager } from "../../lib/pglite-manager";
import { ensureSchema } from "../../lib/db/migrate";

export const PGliteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    (async () => {
      try {
        await pgliteManager.startInitialization();
        await ensureSchema();
        pgliteManager.markSchemaReady();
        console.log("PGlite initialization completed");
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
        throw error;
      }
    })();
  }, []);

  return <>{children}</>;
};
