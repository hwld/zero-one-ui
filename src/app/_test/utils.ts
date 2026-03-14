/**
 *  @return アニメーションが完了したあとに解決するPromise
 */
// アニメーション中はpointer-events:noneが設定されることが多く、
// userEventはpointer-eventsを検証するため、そこで失敗する可能性がある。
// そのため、この関数を使用してアニメーションの完了を待つ
export const waitForAnimation = () => {
  // アニメーションがマイクロタスクとして実行されることが前提。
  // すべてのマイクロタスクを実行したあとに解決するPromiseを返す
  return new Promise((resolve) => setTimeout(() => resolve(undefined), 0));
};

/**
 * VRTでPlaywrightがスクショを撮る前にストーリーの準備完了を待つためのマーカー。
 */
export const storyReadySelector = "body[data-story-ready]";

/**
 * VRTでPlaywrightがスクショを撮る前にストーリーの準備完了を待つためのマーカーを設定する。
 * 非同期データ取得があるストーリーのplay関数の最後で呼ぶ。
 * ストーリーにはtags: ["wait-for-ready"]を設定する必要がある。
 */
export const markStoryReady = () => {
  document.body.dataset.storyReady = "true";
};

/**
 * 本番環境で実行されたときにエラーを出す関数。
 * テスト用のContextProviderを公開するときなどに使用する
 */
export const errorIfProduction = () => {
  if (process.env.NODE_ENV === "production" && process.env.STORYBOOK === undefined) {
    throw new Error(
      `本番環境で使用することができません。 ${JSON.stringify(process.env.STORYBOOK)}`,
    );
  }
};
