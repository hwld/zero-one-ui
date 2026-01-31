/**
 * エラーシミュレーター
 *
 * 開発・デモ用のエラーシミュレーション機能を提供する
 */
class ErrorSimulator {
  private isSimulating = false;

  public start(): void {
    this.isSimulating = true;
  }

  public stop(): void {
    this.isSimulating = false;
  }

  public isActive(): boolean {
    return this.isSimulating;
  }

  public throwIfActive(): void {
    if (this.isSimulating) {
      throw new Error("Simulated error");
    }
  }
}

export const errorSimulator = new ErrorSimulator();
