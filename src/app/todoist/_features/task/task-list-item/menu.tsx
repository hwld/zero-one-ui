import { PiAlarmLight } from "@react-icons/all-files/pi/PiAlarmLight";
import { PiArrowDownLight } from "@react-icons/all-files/pi/PiArrowDownLight";
import { PiArrowFatUp } from "@react-icons/all-files/pi/PiArrowFatUp";
import { PiArrowRightLight } from "@react-icons/all-files/pi/PiArrowRightLight";
import { PiArrowUpLight } from "@react-icons/all-files/pi/PiArrowUpLight";
import { PiBackspace } from "@react-icons/all-files/pi/PiBackspace";
import { PiCalendarLight } from "@react-icons/all-files/pi/PiCalendarLight";
import { PiCommand } from "@react-icons/all-files/pi/PiCommand";
import { PiCopyLight } from "@react-icons/all-files/pi/PiCopyLight";
import { PiCouchLight } from "@react-icons/all-files/pi/PiCouchLight";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiFlag } from "@react-icons/all-files/pi/PiFlag";
import { PiFlagFill } from "@react-icons/all-files/pi/PiFlagFill";
import { PiLinkLight } from "@react-icons/all-files/pi/PiLinkLight";
import { PiPencilSimpleLineLight } from "@react-icons/all-files/pi/PiPencilSimpleLineLight";
import { PiPuzzlePieceLight } from "@react-icons/all-files/pi/PiPuzzlePieceLight";
import { PiSunLight } from "@react-icons/all-files/pi/PiSunLight";
import { PiTrashLight } from "@react-icons/all-files/pi/PiTrashLight";
import { forwardRef } from "react";
import { MenuButtonItem, MenuIconButtonItem } from "../../../_components/menu/item";
import { MenuSeparator, MenuActions, Menu } from "../../../_components/menu/menu";
import { useDeleteTask } from "../use-delete-task";
import { ActionButton } from "./action-button";

type Props = { taskId: string; taskboxId: string };

export const TaskListItemMenu = forwardRef<HTMLButtonElement, Props>(function TaskListItemMenu(
  { taskId, taskboxId, ...props },
  ref,
) {
  const deleteTask = useDeleteTask();

  const handleDeleteTask = () => {
    deleteTask.mutate({ taskId, taskboxId });
  };

  return (
    <Menu
      placement="bottom-start"
      width={250}
      trigger={<ActionButton ref={ref} icon={PiDotsThreeOutlineLight} {...props} />}
    >
      <MenuButtonItem icon={PiArrowUpLight} label="タスクを上に追加" />
      <MenuButtonItem icon={PiArrowDownLight} label="タスクを下に追加" />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiPencilSimpleLineLight}
        label="編集"
        right={
          <>
            <PiCommand />E
          </>
        }
      />
      <MenuSeparator />
      <MenuActions label="予定日" right="T">
        <MenuIconButtonItem
          label="今日"
          icon={<PiCalendarLight className="size-5 text-green-600" />}
        />
        <MenuIconButtonItem label="明日" icon={<PiSunLight className="size-5 text-orange-600" />} />
        <MenuIconButtonItem
          label="今週末"
          icon={<PiCouchLight className="size-5 text-blue-600" />}
        />
        <MenuIconButtonItem
          label="来週"
          icon={<PiArrowRightLight className="size-5 text-purple-600" />}
        />
        <MenuIconButtonItem label="その他" icon={<PiDotsThreeOutlineLight className="size-5" />} />
      </MenuActions>
      <MenuActions label="優先度" right="Y">
        <MenuIconButtonItem label="優先度1" icon={<PiFlagFill className="size-5 text-red-600" />} />
        <MenuIconButtonItem
          label="優先度2"
          icon={<PiFlagFill className="size-5 text-orange-600" />}
        />
        <MenuIconButtonItem
          label="優先度3"
          icon={<PiFlagFill className="size-5 text-blue-600" />}
        />
        <MenuIconButtonItem label="優先度4" icon={<PiFlag className="size-5" />} />
      </MenuActions>
      <MenuSeparator />
      <MenuButtonItem icon={PiAlarmLight} label="リマインダー" />
      <MenuSeparator />
      <MenuButtonItem icon={PiArrowRightLight} label="次へ移動..." right="V" />
      <MenuButtonItem icon={PiCopyLight} label="複製" />
      <MenuButtonItem
        icon={PiLinkLight}
        label="タスクのリンクをコピー"
        right={
          <>
            <PiArrowFatUp />
            <PiCommand />C
          </>
        }
      />
      <MenuSeparator />
      <MenuButtonItem icon={PiPuzzlePieceLight} label="拡張機能を追加..." />
      <MenuSeparator />
      <MenuButtonItem
        icon={PiTrashLight}
        label="削除する"
        right={
          <>
            <PiCommand />
            <PiBackspace />
          </>
        }
        variant="destructive"
        onClick={handleDeleteTask}
      />
    </Menu>
  );
});
