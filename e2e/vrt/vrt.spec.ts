import { test, expect } from "@playwright/test";
import { storyReadySelector } from "../../src/app/_test/utils";

type StoryIndexEntry = {
  id: string;
  type: string;
  subtype: string;
  title: string;
  name: string;
  tags: string[];
};

type StoryIndex = {
  entries: Record<string, StoryIndexEntry>;
};

test("visual regression", async ({ page }) => {
  const response = await page.request.get("/index.json");
  const index: StoryIndex = await response.json();

  const stories = Object.values(index.entries).filter(
    (entry) => entry.type === "story" && entry.subtype === "story",
  );

  for (const story of stories) {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForLoadState("domcontentloaded");

    // CSSアニメーション・トランジションを無効化してスクショを安定させる
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });

    // Storybookがストーリーの描画を完了するとbodyにsb-show-mainクラスが付く
    await page.locator("body.sb-show-main").waitFor({ timeout: 10000 });

    // play関数でdata-story-readyを設定するストーリーはそれを待つ
    if (story.tags?.includes("wait-for-ready")) {
      await page.locator(storyReadySelector).waitFor({ timeout: 10000 });
    }

    await expect
      .soft(page, `${story.title}/${story.name}`)
      .toHaveScreenshot(`${story.id}.png`);
  }
});
