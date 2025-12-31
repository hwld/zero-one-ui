"use client";

import clsx from "clsx";
import { pages } from "./pages";
import { IoLogoGithub } from "@react-icons/all-files/io/IoLogoGithub";
import { PageCard } from "./page-card";
import { useBodyBgColor } from "../lib/useBodyBgColor";

export default function Home() {
  const bgClass = "bg-neutral-950";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-dvh flex-col items-center overflow-auto pt-[200px] pb-6",
        // chromeでキーボードを操作しているとなぜかfocus-visibleがあたることがあるので
        "focus-visible:outline-hidden",
        bgClass,
      )}
      style={{ colorScheme: "dark" }}
    >
      <div className="flex w-[500px] max-w-full flex-col items-center gap-6 px-5 text-neutral-100">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">zero one ui</h1>
          <a
            href="https://github.com/hwld/zero-one-ui"
            target="_blank"
            className="grid size-[30px] place-items-center rounded-sm transition-colors hover:bg-white/15"
          >
            <IoLogoGithub
              className="fill-neutral-100"
              style={{ fontSize: "23" }}
            />
          </a>
        </div>
        <div className="grid w-[300px] gap-2 text-center text-sm text-neutral-400">
          <p>ReactでいろんなUIを作るためのプロジェクト</p>
          <p>
            `<kbd className="text-neutral-100">/</kbd>
            `キーでページの移動やページ毎のコマンドを
            <br />
            実行するためのメニューを開くことができる
          </p>
        </div>
      </div>
      <div className="mt-[80px] grid max-w-[950px] grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((p, i) => {
          return <PageCard page={p} key={p.href} number={i + 1} />;
        })}
      </div>
    </div>
  );
}
