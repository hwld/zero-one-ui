"use client";

import * as React from "react";
import { AlertCircleIcon, CheckCircle2Icon, XIcon } from "lucide-react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "../../../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-auto bottom-16 left-0 z-100 flex w-full max-w-[420px] flex-col p-4",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    variant: "success" | "error";
  }
>(({ className, variant, title, description, ...props }, ref) => {
  const variantIconBackgroundClass = {
    success: "bg-green-600",
    error: "bg-red-600",
  };
  const variantIconClass = {
    success: CheckCircle2Icon,
    error: AlertCircleIcon,
  };

  const Icon = variantIconClass[variant];

  return (
    <ToastPrimitives.Root
      onSwipeStart={(e) => e.preventDefault()}
      onSwipeMove={(e) => e.preventDefault()}
      onSwipeEnd={(e) => e.preventDefault()}
      onSwipeCancel={(e) => e.preventDefault()}
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex min-h-16 w-full items-stretch justify-between space-x-2 overflow-hidden rounded-md bg-neutral-600 text-neutral-100 shadow-lg data-[state=closed]:animate-toastExit data-[state=open]:animate-toastEnter",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 items-center p-4",
          variantIconBackgroundClass[variant],
        )}
      >
        <Icon size={20} />
      </div>
      <div className="flex grow flex-col py-4 pl-2">
        {title && <div className="text-sm font-bold">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </div>
      <div className="flex items-center py-4 pr-4">
        <ToastPrimitives.Close className="grid size-7 place-items-center rounded-md transition-colors hover:bg-white/15">
          <XIcon size={20} />
        </ToastPrimitives.Close>
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export { type ToastProps, ToastProvider, ToastViewport, Toast };
