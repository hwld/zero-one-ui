import { PiCalendarDotsFill } from "@react-icons/all-files/pi/PiCalendarDotsFill";
import { PiCalendarDotsLight } from "@react-icons/all-files/pi/PiCalendarDotsLight";
import { PiCalendarFill } from "@react-icons/all-files/pi/PiCalendarFill";
import { PiCalendarLight } from "@react-icons/all-files/pi/PiCalendarLight";
import { PiMagnifyingGlassLight } from "@react-icons/all-files/pi/PiMagnifyingGlassLight";
import { PiSquaresFourFill } from "@react-icons/all-files/pi/PiSquaresFourFill";
import { PiSquaresFourLight } from "@react-icons/all-files/pi/PiSquaresFourLight";
import { PiTrayFill } from "@react-icons/all-files/pi/PiTrayFill";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { Routes } from "../../routes";
import { Tooltip } from "../tooltip";
import { SidebarListButton, SidebarListLink } from "./item";
import { TaskCreateButton } from "../../_features/task/task-create-button";
import { useInbox } from "../../_features/inbox/use-inbox";

type Props = { currentRoute: string };

export const SidebarNavList: React.FC<Props> = ({ currentRoute }) => {
  const { data: inbox } = useInbox();

  return (
    <nav>
      <ul>
        <li>
          <Tooltip label="タスクを追加" keys={["Q"]} placement="right">
            <TaskCreateButton />
          </Tooltip>
        </li>
        <Tooltip label="クイック検索を開く" keys={["Cmd", "K"]} placement="right">
          <SidebarListButton icon={PiMagnifyingGlassLight}>検索</SidebarListButton>
        </Tooltip>

        <Tooltip label="インボックスに移動" keys={["G", "I"]} placement="right">
          <SidebarListLink
            href={Routes.inbox()}
            currentRoute={currentRoute}
            icon={PiTrayLight}
            activeIcon={PiTrayFill}
            right={inbox?.taskCount ?? 0}
          >
            インボックス
          </SidebarListLink>
        </Tooltip>

        <Tooltip label="今日に移動" keys={["G", "T"]} placement="right">
          <SidebarListLink
            href={Routes.today()}
            currentRoute={currentRoute}
            icon={PiCalendarLight}
            activeIcon={PiCalendarFill}
          >
            今日
          </SidebarListLink>
        </Tooltip>

        <Tooltip label="近日予定に移動" keys={["G", "U"]} placement="right">
          <SidebarListLink
            href={Routes.upcoming()}
            currentRoute={currentRoute}
            icon={PiCalendarDotsLight}
            activeIcon={PiCalendarDotsFill}
          >
            近日予定
          </SidebarListLink>
        </Tooltip>

        <Tooltip label="フィルター&ラベルに移動" keys={["G", "V"]} placement="right">
          <SidebarListLink
            href={Routes.filtersLabels()}
            currentRoute={currentRoute}
            icon={PiSquaresFourLight}
            activeIcon={PiSquaresFourFill}
          >
            フィルター & ラベル
          </SidebarListLink>
        </Tooltip>
      </ul>
    </nav>
  );
};
