import { PGlite } from "@electric-sql/pglite";

/**
 * PGliteマネージャー
 *
 * 全アプリで共有する単一のPGliteインスタンスを管理する。
 * IndexedDBに永続化され、非同期で初期化される。
 */
const DB_NAME = "zero-one-ui-db";

class PGliteManager {
  private db: PGlite | null = null;
  private initializationPromise: Promise<void> | null = null;
  private isReady = false;
  private schemaReady = false;
  private schemaReadyPromise: Promise<void> | null = null;
  private schemaReadyResolve: (() => void) | null = null;

  /**
   * DB初期化を開始する（複数回呼ばれても安全）
   */
  public startInitialization(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.initialize();
    return this.initializationPromise;
  }

  /**
   * DB初期化が完了するまで待機する
   */
  public async waitForReady(): Promise<void> {
    if (this.isReady) {
      return;
    }

    if (!this.initializationPromise) {
      throw new Error(
        "DB initialization has not started. Call startInitialization() first.",
      );
    }

    await this.initializationPromise;
  }

  /**
   * DBインスタンスを取得する（スキーマ初期化完了を待機）
   */
  public async getDb(): Promise<PGlite> {
    await this.waitForSchemaReady();
    if (!this.db) {
      throw new Error("DB is not initialized.");
    }
    return this.db;
  }

  /**
   * DBインスタンスを取得する（DB初期化のみ待機、スキーマ初期化中に使用）
   */
  public async getRawDb(): Promise<PGlite> {
    await this.waitForReady();
    if (!this.db) {
      throw new Error("DB is not initialized.");
    }
    return this.db;
  }

  /**
   * DBが初期化済みかどうかを返す
   */
  public isInitialized(): boolean {
    return this.isReady;
  }

  /**
   * スキーマ初期化（テーブル作成・シードデータ投入）の完了を待つ
   */
  public waitForSchemaReady(): Promise<void> {
    if (this.schemaReady) {
      return Promise.resolve();
    }
    if (!this.schemaReadyPromise) {
      this.schemaReadyPromise = new Promise((resolve) => {
        this.schemaReadyResolve = resolve;
      });
    }
    return this.schemaReadyPromise;
  }

  /**
   * スキーマ初期化が完了したことを通知する
   */
  public markSchemaReady(): void {
    this.schemaReady = true;
    if (this.schemaReadyResolve) {
      this.schemaReadyResolve();
    }
    // リセット後に解決済みプロミスを再利用しないようにクリア
    this.schemaReadyResolve = null;
    this.schemaReadyPromise = null;
  }

  /**
   * publicスキーマの全テーブルをDROPしてDBをリセットする
   */
  public async resetDb(): Promise<void> {
    await this.waitForReady();
    if (!this.db) {
      throw new Error("DB is not initialized.");
    }

    const result = await this.db.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
    );

    for (const row of result.rows) {
      await this.db.exec(
        `DROP TABLE IF EXISTS "${row.tablename}" CASCADE`,
      );
    }
  }

  private async initialize(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    try {
      this.db = new PGlite(`idb://${DB_NAME}`);
      await this.db.query("SELECT 1");
      this.isReady = true;
      console.log("PGlite initialized successfully");
    } catch (error) {
      console.error("Failed to initialize PGlite:", error);
      this.isReady = false;
      throw error;
    }
  }
}

export const pgliteManager = new PGliteManager();
