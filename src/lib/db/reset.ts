import { pgliteManager } from "../pglite-manager";

/**
 * 全アプリのDBをリセットする
 */
export async function resetAllData(): Promise<void> {
  try {
    localStorage.removeItem("zero-one-ui-db-version");
    await pgliteManager.resetDb();
  } catch (error) {
    console.error("Failed to reset all data:", error);
    throw error;
  }
}
