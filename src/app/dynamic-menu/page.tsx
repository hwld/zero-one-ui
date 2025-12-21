"use client";

import { NextPage } from "next";
import { Menu } from "./_components/menu/menu";
import clsx from "clsx";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const Page: NextPage = () => {
  const bgClass = "bg-neutral-900";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "flex h-dvh justify-center pt-[50px] text-neutral-900",
        bgClass,
      )}
    >
      <div className="mt-[500px]">
        <Menu />
      </div>
    </div>
  );
};

export default Page;
