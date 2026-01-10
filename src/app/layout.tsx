import type { Metadata } from "next";
import "./globals.css";
import { GlobalCommandDialog } from "./_providers/global-command/global-command-provider";
import { Providers } from "./_providers/providers";
import { Inter } from "next/font/google";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "zero one ui",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* page毎にbodyのbg-colorを設定できるようにする */}
      <body className={clsx(inter.className)}>
        <Providers>
          {children}
          <GlobalCommandDialog />
        </Providers>
      </body>
    </html>
  );
}
