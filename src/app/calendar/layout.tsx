"use client";
import { PropsWithChildren } from "react";
import { ToastProvider } from "./_components/toast";
import { DeleteEventProvider } from "./_features/event/use-delete-event";
import { QueryClientProvider } from "./_providers/query-client-provider";
import dynamic from "next/dynamic";
import { AppStateProvider } from "./_components/use-app-state";

// new Date()で現在時刻をuseStateの初期値として使っているので、クライアント側でだけレンダリングさせる。
// 何も指定しないと、ビルド時にレンダリングされて、ビルド時の時間が初期値としてstateに入ってしまう。
const MinuteClockProviderCC = dynamic(
  () =>
    import("./_components/use-minute-clock").then((m) => m.MinuteClockProvider),
  { ssr: false },
);

const Layout: React.FC<LayoutProps<"/calendar">> = ({ children }) => {
  return (
    <ToastProvider>
      <MinuteClockProviderCC>
        <QueryClientProvider>
          <AppStateProvider>
            <DeleteEventProvider>{children}</DeleteEventProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </MinuteClockProviderCC>
    </ToastProvider>
  );
};

export default Layout;
