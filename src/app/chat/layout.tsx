"use client";

import { ReactNode } from "react";
import { ChatPanel } from "./_components/chat-panel/chat-panel";
import { ServerSidebar } from "./_components/server-sidebar/server-sidebar";
import { SideBar } from "./_components/sidebar/sidebar";
import clsx from "clsx";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const ChatPage: React.FC<LayoutProps<"/chat">> = ({ children }) => {
  const bgClass = "bg-neutral-800";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "grid h-dvh grid-cols-[70px_250px_1fr] text-neutral-100",
        bgClass,
      )}
      style={{ colorScheme: "dark" }}
    >
      <ServerSidebar />
      <SideBar />
      <ChatPanel />
      <div className="fixed">{children}</div>
    </div>
  );
};

export default ChatPage;
