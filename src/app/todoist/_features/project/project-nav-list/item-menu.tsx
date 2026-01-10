import { PiArchiveLight } from "@react-icons/all-files/pi/PiArchiveLight";
import { PiArrowDownLight } from "@react-icons/all-files/pi/PiArrowDownLight";
import { PiArrowUpLight } from "@react-icons/all-files/pi/PiArrowUpLight";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { PiCopyLight } from "@react-icons/all-files/pi/PiCopyLight";
import { PiDownloadSimpleLight } from "@react-icons/all-files/pi/PiDownloadSimpleLight";
import { PiEnvelopeSimpleLight } from "@react-icons/all-files/pi/PiEnvelopeSimpleLight";
import { PiHeartLight } from "@react-icons/all-files/pi/PiHeartLight";
import { PiLinkLight } from "@react-icons/all-files/pi/PiLinkLight";
import { PiListBulletsLight } from "@react-icons/all-files/pi/PiListBulletsLight";
import { PiPencilSimpleLineLight } from "@react-icons/all-files/pi/PiPencilSimpleLineLight";
import { PiPulseLight } from "@react-icons/all-files/pi/PiPulseLight";
import { PiPuzzlePieceLight } from "@react-icons/all-files/pi/PiPuzzlePieceLight";
import { PiSelectionBackgroundLight } from "@react-icons/all-files/pi/PiSelectionBackgroundLight";
import { PiShareLight } from "@react-icons/all-files/pi/PiShareLight";
import { PiUploadSimpleLight } from "@react-icons/all-files/pi/PiUploadSimpleLight";
import { MenuButtonItem } from "../../../_components/menu/item";
import { Menu, MenuSeparator } from "../../../_components/menu/menu";
import { ReactNode } from "react";
import { PiTrashLight } from "@react-icons/all-files/pi/PiTrashLight";

type Props = {
  trigger: ReactNode;
  onOpenChange: (open: boolean) => void;
  onOpenDeleteDialog: () => void;
  onOpenUpdateDialog: () => void;
  onOpenCreateBeforeDialog: () => void;
  onOpenCreateAfterDialog: () => void;
};

export const ProjectNavItemMenu: React.FC<Props> = ({
  trigger,
  onOpenChange,
  onOpenDeleteDialog,
  onOpenUpdateDialog,
  onOpenCreateBeforeDialog,
  onOpenCreateAfterDialog,
}) => {
  return (
    <Menu
      width={300}
      placement="right-start"
      onOpenChange={onOpenChange}
      trigger={trigger}
    >
      <MenuButtonItem
        icon={PiArrowUpLight}
        label="プロジェクトを上に追加"
        onClick={onOpenCreateBeforeDialog}
      />
      <MenuButtonItem
        icon={PiArrowDownLight}
        label="プロジェクトを下に追加"
        onClick={onOpenCreateAfterDialog}
      />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiPencilSimpleLineLight}
        label="編集"
        onClick={onOpenUpdateDialog}
      />
      <MenuButtonItem icon={PiHeartLight} label="お気に入りに追加" />
      <MenuButtonItem icon={PiCopyLight} label="複製" />
      <MenuSeparator />
      <MenuButtonItem icon={PiShareLight} label="共有" />
      <MenuSeparator />
      <MenuButtonItem icon={PiLinkLight} label="プロジェクトリンクをコピー" />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiSelectionBackgroundLight}
        label={
          <div className="flex items-center gap-1">
            テンプレートとして保存する
            <span className="flex h-5 items-center rounded-sm bg-green-100 px-[5px] text-xs font-bold tracking-wider text-green-600">
              NEW
            </span>
          </div>
        }
      />
      <MenuButtonItem icon={PiBrowsersLight} label="テンプレートを見る" />
      <MenuSeparator />
      <MenuButtonItem icon={PiDownloadSimpleLight} label="CSVからインポート" />
      <MenuButtonItem
        icon={PiUploadSimpleLight}
        label="CSVとしてエクスポート"
      />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiEnvelopeSimpleLight}
        label="メールでタスクを追加"
      />
      <MenuButtonItem
        icon={PiListBulletsLight}
        label="プロジェクトカレンダーフィード"
      />
      <MenuSeparator />
      <MenuButtonItem icon={PiPulseLight} label="アクティビティログ" />
      <MenuSeparator />
      <MenuButtonItem icon={PiPuzzlePieceLight} label="拡張機能を追加" />
      <MenuSeparator />
      <MenuButtonItem icon={PiArchiveLight} label="アーカイブ" />
      <MenuButtonItem
        icon={PiTrashLight}
        label="削除"
        variant="destructive"
        onClick={onOpenDeleteDialog}
      />
    </Menu>
  );
};
