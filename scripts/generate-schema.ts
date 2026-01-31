import { execSync } from "child_process";
import { readFileSync, writeFileSync, rmSync, readdirSync } from "fs";
import { join } from "path";

const MIGRATIONS_DIR = "src/lib/db/migrations";
const SCHEMA_FILE = "src/lib/db/schema.sql.ts";

async function main() {
  console.log("🔄 Generating schema...\n");

  // migrations フォルダをクリーン
  try {
    rmSync(MIGRATIONS_DIR, { recursive: true, force: true });
    console.log("✅ Cleaned migrations directory");
  } catch {
    console.log("ℹ️  No migrations directory to clean");
  }

  // drizzle-kit で SQL を生成
  console.log("\n🔨 Running drizzle-kit generate...");
  try {
    execSync("pnpm exec drizzle-kit generate", { stdio: "inherit" });
  } catch {
    console.error("❌ Failed to generate migrations");
    process.exit(1);
  }

  // 生成された SQL を読み込む
  console.log("\n📖 Reading generated SQL...");
  const sqlFiles = readdirSync(MIGRATIONS_DIR).filter((f) =>
    f.endsWith(".sql"),
  );
  if (sqlFiles.length === 0) {
    console.error("❌ No SQL file generated");
    process.exit(1);
  }

  const sqlFile = sqlFiles.sort()[0];
  const newSql = readFileSync(join(MIGRATIONS_DIR, sqlFile), "utf-8").trim();
  console.log(`✅ Read ${sqlFile}`);

  // 現在のバージョンとSQLを取得
  console.log("\n🔢 Checking for schema changes...");
  let currentVersion = 0;
  let currentSql = "";
  try {
    const existing = await import(`../${SCHEMA_FILE}`);
    currentVersion = existing.DB_SCHEMA_VERSION || 0;
    currentSql = (existing.schemaSql || "").trim();
  } catch {
    // ファイルが存在しない場合は 0 から開始
  }

  // SQLに変更がある場合のみバージョンをインクリメント
  const newVersion =
    currentSql === newSql ? currentVersion : currentVersion + 1;
  if (currentSql === newSql) {
    console.log(
      `ℹ️  No schema changes detected, keeping version ${currentVersion}`,
    );
  } else {
    console.log(
      `✅ Schema changed, version: ${currentVersion} → ${newVersion}`,
    );
  }

  // schema.sql.ts に書き込む
  console.log("\n📝 Writing to schema.sql.ts...");
  const content = `/**
 * DB スキーマ SQL とバージョン
 *
 * このファイルは自動生成される。手動で編集しない。
 *
 * スキーマ変更手順:
 * 1. src/app/xxx/_backend/db/schema.ts を編集
 * 2. pnpm run db:generate を実行
 * → このファイルが自動更新される
 */

export const DB_SCHEMA_VERSION = ${newVersion};

export const schemaSql = \`${newSql}\`;
`;

  writeFileSync(SCHEMA_FILE, content, "utf-8");
  console.log("✅ Updated schema.sql.ts");

  console.log("\n✨ Schema generation complete!\n");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
