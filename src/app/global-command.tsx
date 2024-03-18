"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pages } from "./pages";
import Link from "next/link";
import { HomeIcon, LucideIcon } from "lucide-react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

export type CommandItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => Promise<unknown> | void;
};

const CommandItemsContext = createContext<CommandItem[] | undefined>(undefined);
export const useCommandItems = (): CommandItem[] => {
  const context = useContext(CommandItemsContext);
  if (context === undefined) {
    throw new Error("GlobalCommandProviderが存在しません。");
  }
  return context;
};

type CommandItemsAction = {
  addCommandItems: (items: CommandItem[]) => void;
  removeCommandItems: (ids: string[]) => void;
};
const CommandItemsActionContext = createContext<CommandItemsAction | undefined>(
  undefined,
);
export const useCommandItemsAction = (): CommandItemsAction => {
  const context = useContext(CommandItemsActionContext);
  if (context === undefined) {
    throw new Error("GLobalCOmmandProviderが存在しません。");
  }
  return context;
};

export const GlobalCommandProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [commandItems, setCommandItems] = useState<CommandItem[]>([]);

  const action: CommandItemsAction = useMemo(() => {
    return {
      addCommandItems: (newItems) => {
        setCommandItems((items) => {
          return Array.from(new Set([...items, ...newItems]));
        });
      },
      removeCommandItems: (itemIds) => {
        setCommandItems((items) => {
          return items.filter((i) => !itemIds.includes(i.id));
        });
      },
    };
  }, []);

  return (
    <CommandItemsContext.Provider value={commandItems}>
      <CommandItemsActionContext.Provider value={action}>
        {children}
      </CommandItemsActionContext.Provider>
    </CommandItemsContext.Provider>
  );
};

export const GlobalCommand: React.FC = () => {
  const commands = useCommandItems();
  const [isOpen, setIsOpen] = useState(false);

  const onCloseDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "/" && event.target === document.body) {
        setIsOpen(true);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 h-[350px] w-[95%] max-w-[550px] rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
              >
                <Command className="flex h-full flex-col gap-2">
                  <div className="flex flex-col gap-2 px-4 pt-4">
                    <div className="flex h-5 w-fit items-center rounded bg-white/10 px-2 text-xs text-zinc-400">
                      Command
                    </div>
                    <Command.Input
                      placeholder="Where would you like to go?"
                      className="bg-transparent p-1 text-sm placeholder:text-zinc-500 focus-visible:outline-none"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-600" />
                  <Command.List className="flex flex-col overflow-auto px-2 pb-4">
                    <Command.Empty className="mt-4 w-full text-center text-sm text-zinc-300">
                      No results found.
                    </Command.Empty>
                    <div className="space-y-2">
                      <Group heading="pages">
                        <NavItem
                          icon={HomeIcon}
                          label="ホーム"
                          href="/"
                          onBeforeNavigate={onCloseDialog}
                        />
                        {pages.map((p) => {
                          return (
                            <NavItem
                              key={p.title}
                              icon={p.icon}
                              label={p.title}
                              href={p.href}
                              onBeforeNavigate={onCloseDialog}
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
                                onAfterAction={onCloseDialog}
                              />
                            );
                          })}
                        </Group>
                      )}
                    </div>
                  </Command.List>
                </Command>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

const Group: React.FC<{ heading: string; children: ReactNode }> = ({
  heading,
  children,
}) => {
  return (
    <Command.Group
      heading={heading}
      className="[&>*[cmdk-group-heading]]:mb-1 [&>*[cmdk-group-heading]]:text-xs [&>*[cmdk-group-heading]]:text-zinc-400"
    >
      {children}
    </Command.Group>
  );
};

type NavItemProps = {
  icon: LucideIcon;
  href: string;
  label: string;
  onBeforeNavigate: () => void;
};
const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  href,
  label,
  onBeforeNavigate,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    onBeforeNavigate();
    router.push(href);
  };

  return (
    <Command.Item
      className="h-8 rounded px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={handleNavigate}
    >
      <Link
        href={href}
        className="flex h-full items-center gap-2"
        onClick={onBeforeNavigate}
      >
        <Icon size={15} />
        {label}
      </Link>
    </Command.Item>
  );
};

type CommandItemProps = { command: CommandItem; onAfterAction?: () => void };
const CommandItem: React.FC<CommandItemProps> = ({
  command,
  onAfterAction,
}) => {
  const Icon = command.icon;

  return (
    <Command.Item
      className="flex h-8 items-center gap-2 rounded px-2 text-sm transition-colors aria-selected:bg-white/10"
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
