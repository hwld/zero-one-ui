import { pgliteManager } from "../pglite-manager";
import { DB_SCHEMA_VERSION, schemaSql } from "./schema.sql";
import { seedAllData } from "./seed";

const VERSION_KEY = "zero-one-ui-db-version";

/**
 * 全アプリのDBをリセットする（テーブルをDROPしてスキーマ再作成+seed投入）
 */
export async function resetAllData(): Promise<void> {
  await pgliteManager.resetDb();

  const db = await pgliteManager.getRawDb();
  await db.exec(schemaSql);
  await seedAllData();
  localStorage.setItem(VERSION_KEY, DB_SCHEMA_VERSION.toString());
}
