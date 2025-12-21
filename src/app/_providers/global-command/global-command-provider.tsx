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
import { LucideIcon } from "lucide-react";
import { GlobalCommand } from "./global-command";

export type CommandItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => Promise<unknown> | void;
};

type GlobalCommandData = { commands: CommandItem[] };

const GlobalCommandDataContext = createContext<GlobalCommandData | undefined>(
  undefined,
);
export const useGlobalCommandData = (): GlobalCommandData => {
  const context = useContext(GlobalCommandDataContext);
  if (context === undefined) {
    throw new Error("GlobalCommandProviderが存在しません。");
  }
  return context;
};

type GlobalCommandAction = {
  addCommandItems: (items: CommandItem[]) => void;
  removeCommandItems: (ids: string[]) => void;
};

const GlobalCommandActionContext = createContext<
  GlobalCommandAction | undefined
>(undefined);
const useGlobalCommandAction = (): GlobalCommandAction => {
  const context = useContext(GlobalCommandActionContext);
  if (context === undefined) {
    throw new Error("GLobalCOmmandProviderが存在しません。");
  }
  return context;
};

export const GlobalCommandProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<GlobalCommandData>({
    commands: [],
  });

  const action: GlobalCommandAction = useMemo(() => {
    return {
      addCommandItems: (newItems) => {
        setData((data) => {
          return {
            ...data,
            commands: Array.from(new Set([...data.commands, ...newItems])),
          };
        });
      },
      removeCommandItems: (itemIds) => {
        setData((data) => {
          return {
            ...data,
            commands: data.commands.filter((i) => !itemIds.includes(i.id)),
          };
        });
      },
    };
  }, []);

  return (
    <GlobalCommandDataContext.Provider value={data}>
      <GlobalCommandActionContext.Provider value={action}>
        {children}
      </GlobalCommandActionContext.Provider>
    </GlobalCommandDataContext.Provider>
  );
};

type GlobalCommandConfig = {
  newCommands: Omit<CommandItem, "id">[];
};

export const useGlobalCommandConfig = ({
  newCommands,
}: GlobalCommandConfig) => {
  const { addCommandItems, removeCommandItems } = useGlobalCommandAction();

  useEffect(() => {
    const commands = newCommands.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
    }));

    addCommandItems(commands);

    return () => {
      removeCommandItems(commands.map((c) => c.id));
    };
  }, [addCommandItems, newCommands, removeCommandItems]);
};

export const GlobalCommandDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onCloseDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !(
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
      ) {
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
                className="fixed inset-0 z-99 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 z-100 h-[350px] w-[95%] max-w-[550px]"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
              >
                <GlobalCommand onClickItem={onCloseDialog} />
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
