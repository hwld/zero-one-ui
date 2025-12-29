"use client";

import { useBodyBgColor } from "../lib/useBodyBgColor";
import { GlobalCommand } from "./_providers/global-command/global-command";
import clsx from "clsx";

const NotFoundPage: React.FC = () => {
  const bgClass = "bg-neutral-950";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-dvh w-full flex-col items-center justify-center gap-14 text-neutral-100",
        bgClass
      )}
    >
      <div className="flex flex-col items-center gap-2 text-sm">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="text-center">
          ページが存在しません
          <br />
          下のメニューからページに移動することができます
        </p>
      </div>
      <div className="h-[450px] w-[95%] max-w-[600px]">
        <GlobalCommand />
      </div>
    </div>
  );
};

export default NotFoundPage;
