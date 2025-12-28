import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import * as RxToast from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "motion/react";
import { TbAlertCircle } from "@react-icons/all-files/tb/TbAlertCircle";
import { TbInfoCircle } from "@react-icons/all-files/tb/TbInfoCircle";
import { TbX } from "@react-icons/all-files/tb/TbX";
import { Button, IconButton } from "./button";
import { OmitDistributive } from "../utils";
import clsx from "clsx";

type CloseFn = (option?: { withoutCallback: boolean }) => void;

type ToastType = "info" | "error";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  onClose?: () => void;
} & (
  | { action?: undefined }
  | { action: (params: { close: CloseFn }) => void; actionText: string }
);

type CreateToastInput = OmitDistributive<Toast, "id">;

type ToastContext = [Toast[], Dispatch<SetStateAction<Toast[]>>];
const ToastContext = createContext<ToastContext | undefined>(undefined);

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const toastState = useState<Toast[]>([]);
  const [toasts, setToasts] = toastState;

  const closeToast = (toast: Toast, option?: { withoutCallback: boolean }) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== toast.id));

    if (!option?.withoutCallback) {
      toast.onClose?.();
    }
  };

  const handleOpenChange = (open: boolean, toast: Toast) => {
    if (open) {
      return;
    }
    closeToast(toast);
  };

  const handleClickClose = (toast: Toast) => {
    closeToast(toast);
  };

  const handleClickAction = (toast: Toast) => {
    toast.action?.({
      close: (option?) => {
        closeToast(toast, option);
      },
    });
  };

  return (
    <ToastContext.Provider value={toastState}>
      <RxToast.Provider>
        {children}
        <AnimatePresence>
          {toasts.map((toast) => {
            const icon = {
              info: <TbInfoCircle size={16} />,
              error: <TbAlertCircle size={16} className="text-red-500" />,
            } satisfies Record<ToastType, unknown>;

            return (
              <RxToast.Root
                key={toast.id}
                asChild
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onOpenChange={(o) => handleOpenChange(o, toast)}
                onSwipeStart={(e) => e.preventDefault()}
                onSwipeMove={(e) => e.preventDefault()}
                onSwipeCancel={(e) => e.preventDefault()}
                onSwipeEnd={(e) => e.preventDefault()}
                forceMount
              >
                <motion.div
                  layout
                  className={clsx(
                    // dialogのoutside clickの判定から除外するためにtoastクラスをつけている
                    "toast relative flex min-h-[80px] w-[320px] gap-2 rounded-sm border border-neutral-300 bg-neutral-50 p-2 text-neutral-700 shadow-sm"
                  )}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                >
                  <div className="mt-1 shrink-0">{icon[toast.type]}</div>
                  <div className="flex grow flex-col justify-between gap-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{toast.title}</div>
                      <div className="shrink-0">
                        <IconButton
                          size="sm"
                          icon={TbX}
                          onClick={() => handleClickClose(toast)}
                        />
                      </div>
                    </div>
                    {toast.description && (
                      <div className="text-xs">{toast.description}</div>
                    )}
                    {toast.action && (
                      <div className="flex w-full justify-end">
                        <Button
                          size="sm"
                          onClick={() => handleClickAction(toast)}
                        >
                          {toast.actionText}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </RxToast.Root>
            );
          })}
        </AnimatePresence>
        <RxToast.Viewport className="fixed right-4 bottom-4 z-100 flex flex-col gap-1" />
      </RxToast.Provider>
    </ToastContext.Provider>
  );
};

const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProviderが存在しません");
  }
  return ctx;
};

export const useToast = () => {
  const [_, setToasts] = useToastContext();

  const toast = useCallback(
    (input: CreateToastInput) => {
      const id = crypto.randomUUID();
      setToasts((toasts) => [...toasts, { id, ...input }]);

      const close = () => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
      };

      return { close };
    },
    [setToasts]
  );

  const infoToast = useCallback(
    (input: OmitDistributive<CreateToastInput, "type">) => {
      toast({ ...input, type: "info" });
    },
    [toast]
  );

  const errorToast = useCallback(
    (input: OmitDistributive<CreateToastInput, "type">) => {
      toast({ ...input, type: "error" });
    },
    [toast]
  );

  return { toast: { info: infoToast, error: errorToast } };
};
