import { ReactNode } from "react";
import { Spacer } from "../spacer";
import clsx from "clsx";

export const SettingsSidebar = () => {
  return (
    <div className="grid grid-cols-[1fr_200px] justify-end overflow-auto bg-neutral-800">
      <div className="col-start-2 flex flex-col gap-4 px-4 py-14">
        <SettingItemGroup name="ユーザー設定">
          <SettingItem active>プロフィール</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>

        <Spacer />

        <SettingItemGroup name="アプリの設定">
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>

        <Spacer />

        <SettingItemGroup name="その他の設定">
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>
      </div>
    </div>
  );
};

const SettingItemGroup: React.FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-neutral-400">{name}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

const SettingItem: React.FC<{ children: ReactNode; active?: boolean }> = ({
  children,
  active,
}) => {
  return (
    <button
      className={clsx(
        "flex justify-start rounded-sm px-4 py-1 transition-colors hover:bg-white/5",
        active ? "bg-white/20 text-neutral-100" : "text-neutral-300",
      )}
    >
      {children}
    </button>
  );
};
