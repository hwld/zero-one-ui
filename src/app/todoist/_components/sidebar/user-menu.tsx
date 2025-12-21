import { PiArrowCircleUpRightLight } from "@react-icons/all-files/pi/PiArrowCircleUpRightLight";
import { PiArrowsClockwiseLight } from "@react-icons/all-files/pi/PiArrowsClockwiseLight";
import { PiBookOpenLight } from "@react-icons/all-files/pi/PiBookOpenLight";
import { PiCaretDownBold } from "@react-icons/all-files/pi/PiCaretDownBold";
import { PiCommand } from "@react-icons/all-files/pi/PiCommand";
import { PiDeviceMobileLight } from "@react-icons/all-files/pi/PiDeviceMobileLight";
import { PiDotFill } from "@react-icons/all-files/pi/PiDotFill";
import { PiGearLight } from "@react-icons/all-files/pi/PiGearLight";
import { PiGiftLight } from "@react-icons/all-files/pi/PiGiftLight";
import { PiGraduationCapLight } from "@react-icons/all-files/pi/PiGraduationCapLight";
import { PiKeyboardLight } from "@react-icons/all-files/pi/PiKeyboardLight";
import { PiLightbulbLight } from "@react-icons/all-files/pi/PiLightbulbLight";
import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { PiPrinterLight } from "@react-icons/all-files/pi/PiPrinterLight";
import { PiPulseLight } from "@react-icons/all-files/pi/PiPulseLight";
import { PiPuzzlePieceLight } from "@react-icons/all-files/pi/PiPuzzlePieceLight";
import { PiQuestionLight } from "@react-icons/all-files/pi/PiQuestionLight";
import { PiSignOutLight } from "@react-icons/all-files/pi/PiSignOutLight";
import { MenuButtonItem, SubMenuTrigger } from "../menu/item";
import { Menu, MenuSeparator } from "../menu/menu";
import { IconType } from "@react-icons/all-files";
import { PiStarDuotone } from "@react-icons/all-files/pi/PiStarDuotone";
import { cn } from "../../../../lib/utils";
import { UserIcon } from "../user-icon";

export const UserMenuTrigger: React.FC = () => {
  return (
    <Menu
      trigger={
        <button className="group/usermenu flex h-8 items-center gap-2 rounded-sm p-2 transition-colors hover:bg-black/5">
          <UserIcon />
          <span className="font-bold">User</span>
          <PiCaretDownBold className="text-stone-600 group-hover/usermenu:text-stone-900" />
        </button>
      }
    >
      <MenuButtonItem
        icon={PiArrowCircleUpRightLight}
        label="Username"
        description="0/5 件のタスク"
        right="O + P"
      />
      <MenuSeparator />
      <MenuButtonItem icon={PiGearLight} label="設定" right="O + S" />
      <MenuButtonItem icon={PiPlusLight} label="チームを追加" />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiPulseLight}
        label="アクティビティログ"
        right="G + A"
      />
      <MenuButtonItem
        icon={PiPrinterLight}
        label="印刷"
        right={
          <>
            <PiCommand />P
          </>
        }
      />

      <Menu
        trigger={<SubMenuTrigger icon={PiBookOpenLight} label="リソース" />}
      >
        <MenuButtonItem icon={PiQuestionLight} label="ヘルプセンター" />
        <MenuButtonItem icon={PiLightbulbLight} label="インスピレーション" />
        <MenuButtonItem icon={PiPuzzlePieceLight} label="連携機能" />
        <MenuButtonItem
          icon={PiKeyboardLight}
          label="キーボードショートカット"
          right="?"
        />
        <MenuButtonItem icon={PiGraduationCapLight} label="始め方ガイド" />
        <MenuButtonItem
          icon={PiDeviceMobileLight}
          label="アプリをダウンロード"
        />
      </Menu>

      <MenuSeparator />
      <MenuButtonItem icon={PiGiftLight} label="新機能のお知らせ" />
      <MenuSeparator />
      <MenuButtonItem icon={StarIcon} label="プロにアップグレード" />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiArrowsClockwiseLight}
        label="同期"
        right="1時間前"
      />
      <MenuSeparator />
      <MenuButtonItem icon={PiSignOutLight} label="ログアウト" />
      <MenuSeparator />
      <MenuButtonItem
        variant="green"
        icon={PiDotFill}
        label={<p className="font-semibold">最新バージョンに更新する</p>}
      />
    </Menu>
  );
};

const StarIcon: IconType = ({ className, ...props }) => {
  return (
    <PiStarDuotone className={cn(className, "fill-yellow-500")} {...props} />
  );
};
