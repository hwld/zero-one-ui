"use client";

import { ReactNode } from "react";
import { pages } from "../../pages";
import Link from "next/link";
import { HomeIcon, LucideIcon } from "lucide-react";
import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import {
  CommandItem as CommandItemType,
  useGlobalCommandData,
} from "./global-command-provider";

type Props = { onClickItem?: () => void };
export const GlobalCommand: React.FC<Props> = ({ onClickItem }) => {
  const pathname = usePathname();
  const currentPage = `/${pathname.split("/")[1]}`;

  const { commands } = useGlobalCommandData();

  return (
    <div
      className="size-full overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <Command className="flex h-full flex-col" loop>
        <div className="flex flex-col gap-2 px-4 pt-4">
          <div className="flex h-5 w-fit items-center rounded-sm bg-white/10 px-2 text-xs text-neutral-400">
            {currentPage}
          </div>
          <Command.Input
            placeholder="Type a page or command..."
            className="bg-transparent p-1 text-sm placeholder:text-neutral-500 focus-visible:outline-hidden"
          />
        </div>

        <div className="mt-2 h-px w-full bg-neutral-600" />

        <Command.List className="flex h-full scroll-p-2 flex-col overflow-auto p-2">
          <Command.Empty className="mt-4 w-full text-center text-sm text-neutral-300">
            No results found.
          </Command.Empty>
          <div className="space-y-2">
            <Group heading="pages">
              <PageItem
                icon={HomeIcon}
                label="ホーム"
                href="/"
                onBeforeNavigate={onClickItem}
              />
              {pages.map((p) => {
                return (
                  <PageItem
                    key={p.title}
                    icon={p.icon}
                    label={p.title}
                    href={p.href}
                    onBeforeNavigate={onClickItem}
                  />
                );
              })}
            </Group>
            {commands.length > 0 && (
              <Group heading="commands">
                {commands.map((command) => {
                  return (
                    <CommandItem
                      key={command.id}
                      command={command}
                      onAfterAction={onClickItem}
                    />
                  );
                })}
              </Group>
            )}
          </div>
        </Command.List>
      </Command>
    </div>
  );
};

const Group: React.FC<{ heading: string; children: ReactNode }> = ({
  heading,
  children,
}) => {
  return (
    <Command.Group
      heading={heading}
      className="[&>*[cmdk-group-heading]]:mb-1 [&>*[cmdk-group-heading]]:text-xs [&>*[cmdk-group-heading]]:text-neutral-400"
    >
      {children}
    </Command.Group>
  );
};

type PageItemProps = {
  icon: LucideIcon;
  href: string;
  label: string;
  onBeforeNavigate?: () => void;
};
const PageItem: React.FC<PageItemProps> = ({
  icon: Icon,
  href,
  label,
  onBeforeNavigate,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    onBeforeNavigate?.();
    router.push(href);
  };

  return (
    <Command.Item
      className="h-8 rounded-sm px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={handleNavigate}
      keywords={["page"]}
    >
      <Link
        href={href}
        className="flex h-full items-center justify-between"
        onClick={onBeforeNavigate}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} />
          <div>{label}</div>
        </div>
        <div className="text-xs text-neutral-400">{href}</div>
      </Link>
    </Command.Item>
  );
};

type CommandItemProps = {
  command: CommandItemType;
  onAfterAction?: () => void;
};
const CommandItem: React.FC<CommandItemProps> = ({
  command,
  onAfterAction,
}) => {
  const Icon = command.icon;

  return (
    <Command.Item
      keywords={["command"]}
      className="flex h-8 cursor-pointer items-center gap-2 rounded-sm px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={async () => {
        await command.action();
        onAfterAction?.();
      }}
    >
      <Icon size={15} />
      {command.label}
    </Command.Item>
  );
};
