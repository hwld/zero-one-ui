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
        "group flex flex-col gap-2 rounded-lg border bg-zinc-800 px-4 pt-4 pb-2 text-zinc-200 transition-colors hover:bg-zinc-700",
        isPrime ? "border-violet-400" : "border-zinc-700",
      )}
    >
      <div className="flex items-center gap-1">
        <p className="text-zinc-400">{props.number}.</p>
        {isPrime && (
          <SparklesIcon className="fill-violet-400 text-violet-400" size={18} />
        )}
        <p>{props.page.title}</p>
      </div>
      <div className="grow text-sm whitespace-pre-wrap text-zinc-400">
        {props.page.description}
      </div>
      <div className="h-px bg-zinc-700" />
      <div className="flex flex-wrap gap-2">
        {props.page.tags.map((t) => (
          <PageCardTag key={t}>{t}</PageCardTag>
        ))}
      </div>
    </Link>
  );
};
