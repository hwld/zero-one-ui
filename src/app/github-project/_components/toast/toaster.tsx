"use client";

import { Toast, ToastProvider, ToastViewport } from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, ...props }) {
        return <Toast key={id} title={title} description={description} {...props} />;
      })}
      <ToastViewport style={{ colorScheme: "dark" }} />
    </ToastProvider>
  );
}
