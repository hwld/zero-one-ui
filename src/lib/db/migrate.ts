import { pgliteManager } from "../pglite-manager";
import { DB_SCHEMA_VERSION, schemaSql } from "./schema.sql";
import { seedAllData } from "./seed";

const VERSION_KEY = "zero-one-ui-db-version";

/**
 * スキーマを作成する（バージョンチェック含む）
 */
export async function ensureSchema(): Promise<void> {
  const savedVersion = localStorage.getItem(VERSION_KEY);
  const savedVersionNum = savedVersion ? Number(savedVersion) : 0;

  // バージョンが一致していれば何もしない
  if (savedVersionNum === DB_SCHEMA_VERSION) {
    return;
  }

  console.log(
    `Schema version mismatch (saved: ${savedVersionNum}, current: ${DB_SCHEMA_VERSION}). Resetting DB...`,
  );

  await pgliteManager.resetDb();

  const db = await pgliteManager.getRawDb();
  await db.exec(schemaSql);
  await seedAllData();
  localStorage.setItem(VERSION_KEY, DB_SCHEMA_VERSION.toString());
  console.log("Schema created successfully");
}
