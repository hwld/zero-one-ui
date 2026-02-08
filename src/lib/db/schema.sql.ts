/**
 * DB スキーマ SQL とバージョン
 *
 * このファイルは自動生成される。手動で編集しない。
 *
 * スキーマ変更手順:
 * 1. src/app/xxx/_backend/db/schema.ts を編集
 * 2. pnpm run db:generate を実行
 * → このファイルが自動更新される
 */

export const DB_SCHEMA_VERSION = 2;

export const schemaSql = `CREATE TABLE "todo1_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo2_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);`;
