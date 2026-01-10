"use client";
import clsx from "clsx";
import Link from "next/link";
import { Page } from "./pages";
import { SparklesIcon } from "lucide-react";
import { PageCardTag } from "./page-card-tag";

type Props = { page: Page; number: number };
export const PageCard: React.FC<Props> = (props) => {
  const isPrime = props.page.tags.includes("PRIME");

  return (
    <Link
      href={props.page.href}
      className={clsx(
        "group flex flex-col gap-2 rounded-lg border bg-neutral-900 px-4 pt-4 pb-2 text-neutral-100 transition-all hover:bg-neutral-800 active:bg-neutral-800",
        isPrime
          ? "border-violet-500"
          : "border-neutral-800 shadow-xs shadow-neutral-700 hover:shadow-none",
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-neutral-400">{props.number}.</p>
        {isPrime && (
          <SparklesIcon className="fill-violet-500 text-violet-500" size={18} />
        )}
        <p>{props.page.title}</p>
      </div>
      <div className="grow text-sm whitespace-pre-wrap text-neutral-400">
        {props.page.description}
      </div>
      <div className="h-px bg-neutral-700" />
      <div className="flex flex-wrap gap-2 py-1">
        {props.page.tags.map((t) => (
          <PageCardTag key={t}>{t}</PageCardTag>
        ))}
      </div>
    </Link>
  );
};
