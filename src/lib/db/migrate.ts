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

  // DB全体をリセットして再作成
  await pgliteManager.waitForReady();
  await pgliteManager.resetDb();
  await pgliteManager.startInitialization();

  const db = await pgliteManager.getRawDb();

  try {
    await db.exec(schemaSql);
    await seedAllData();
    localStorage.setItem(VERSION_KEY, DB_SCHEMA_VERSION.toString());
    console.log("Schema created successfully");
  } catch (error) {
    // 複数回実行された場合、テーブルが既に存在する可能性がある
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log("Schema already exists, updating version");
      localStorage.setItem(VERSION_KEY, DB_SCHEMA_VERSION.toString());
    } else {
      throw error;
    }
  }
}
