# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

様々なUIパターンを実装するためのリポジトリ。レイアウトパターンの学習と、作りたいUIの実装に使用される。各ページは独立したUI実装のサンプルとして機能する。

## 開発コマンド

### 基本的な開発

```bash
pnpm dev           # 開発サーバーを起動 (http://localhost:3000)
pnpm build         # プロダクションビルド (静的エクスポート)
pnpm start         # ビルド後の静的ファイルをサーブ
pnpm lint          # ESLintを実行 (警告0で失敗)
pnpm lint:fix      # ESLintの自動修正
pnpm type-check    # TypeScriptの型チェック
```

### テスト

```bash
pnpm test                # Vitestでユニットテストを実行
pnpm storybook:test      # Storybookのテストを実行
```

### Storybook

```bash
pnpm storybook           # Storybookを起動 (http://localhost:6006)
pnpm storybook:build     # Storybookをビルド
```

### データベーススキーマ管理

```bash
pnpm db:generate         # DBスキーマを生成・更新
```

スキーマ変更時の手順:
1. `src/app/xxx/_backend/db/schema.ts` を編集
2. `pnpm db:generate` を実行
3. 自動的に `src/lib/db/schema.sql.ts` が更新される

## アーキテクチャ

### プロジェクト構成

- **Next.js App Router**: ページルーティングとレイアウト管理
- **静的エクスポート**: `output: "export"` を使用し、完全に静的なサイトとして生成
- **Firebase Hosting**: デプロイ先（cleanUrlsを使用してhtml拡張子を削除）

### データベース - PGlite + Drizzle ORM

ブラウザ内でPostgreSQL互換のデータベースを実装:

- **PGlite**: WebAssemblyベースのPostgreSQLがIndexedDBに永続化される
- **Drizzle ORM**: 型安全なクエリビルダー
- **グローバルシングルトン**: `pgliteManager` (`src/lib/pglite-manager.ts`) が全アプリで共有される単一のPGliteインスタンスを管理
- **自動マイグレーション**: アプリ起動時に `ensureSchema()` (`src/lib/db/migrate.ts`) がスキーマバージョンをチェックし、必要に応じてDBをリセット・再作成
- **スキーマバージョニング**: `DB_SCHEMA_VERSION` がローカルストレージに保存され、スキーマ変更時に自動でDBをリセット

初期化フロー:
1. `PGliteProvider` (`src/app/_providers/pglite-provider.tsx`) がマウント時に実行
2. `pgliteManager.startInitialization()` でPGliteインスタンスを初期化
3. `ensureSchema()` でスキーマバージョンをチェック
4. バージョン不一致時はDBリセット・スキーマ作成・シードデータ投入
5. `pgliteManager.markSchemaReady()` で初期化完了を通知

各アプリのDBアクセス:
- `await pgliteManager.getDb()` でPGliteインスタンスを取得（スキーマ初期化完了を待機）
- Drizzleのクエリビルダーを使用して型安全なクエリを実行

### ページ構成

`src/app/` 以下に各UIサンプルがディレクトリ単位で配置:

- `todo-1/`: PGliteを使ったTodoリスト（データ永続化）
- `todo-2/`: 表形式のTodoリスト
- `chat/`: Discordライクなチャット画面
- `calendar/`: Google Calendar風のカレンダー
- `github-project/`: GitHub Projectsのレイアウト（ライブラリを使わないDnD実装）
- `todoist/`: Todoistのレイアウト
- その他多数（`src/app/pages.ts` に全ページの定義あり）

各ページは独立しており、共通のプロバイダー（`src/app/_providers/`）を除き互いに依存しない。

### スタイリング

- **Tailwind CSS v4**: Utility-firstのCSSフレームワーク
- **Radix UI**: アクセシブルなヘッドレスコンポーネント
- **Motion (Framer Motion)**: アニメーション
- **tailwind-variants**: バリアント管理

### テスト環境

**Vitest** でユニットテストとStorybookテストを実行:

- `vitest.config.mts` で2つのプロジェクトを定義:
  - **unit**: `src/**/*.test.ts` を対象とした通常のユニットテスト
  - **storybook**: Storybookのストーリーをブラウザテストとして実行（Playwright使用）

## 注意事項

### Firebase Hostingとメタデータ

`trailingSlash: true` は使用しない。Next.jsがメタデータファイルを `/page.txt` として読み込むが、Firebase Hostingは `/page/index.txt` に配置するため404エラーが発生する。代わりに、Firebase HostingのcleanUrlsオプションを使用してhtml拡張子を削除する。

### DBスキーマの編集

スキーマファイル (`src/lib/db/schema.ts`) は実際には各アプリのスキーマをre-exportしているだけ（現在は `src/app/todo-1/_backend/db/schema.ts`）。スキーマを編集する際は、実際のスキーマファイルを編集してから `pnpm db:generate` を実行する。

## PR作成の手順

PRを作成する前に、ベースブランチの最新の変更を取り込むこと。

```bash
git fetch origin
git rebase origin/main  # またはベースブランチ名
```

## バグ修正の進め方

バグを修正する際は、まず失敗するテストを書いてバグを再現し、その後に修正を行う。テストが通ることで修正の正しさを確認する。

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes