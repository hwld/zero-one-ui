import { PiPlusLight } from "@react-icons/all-files/pi/PiPlusLight";
import { Menu } from "../../../_components/menu/menu";
import clsx from "clsx";
import Link from "next/link";
import { Routes } from "../../../routes";
import { MenuButtonItem } from "../../../_components/menu/item";
import { PiHashLight } from "@react-icons/all-files/pi/PiHashLight";
import { PiBrowsersLight } from "@react-icons/all-files/pi/PiBrowsersLight";
import { Icon, TreeToggleIconButton, IconButton } from "./icon-button";
import { useState } from "react";
import { ProjectCreateDialog } from "../project-create-dialog";

type Props = {
  active?: boolean;
  isOpen: boolean;
  projectsCount: number;
  onOpenChange: (open: boolean) => void;
};

export const ProjectNavListHeader: React.FC<Props> = ({
  active,
  isOpen,
  projectsCount,
  onOpenChange,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div
      className={clsx(
        "group/sidebar flex h-9 w-full items-center justify-between rounded-sm transition-colors",
        active ? "bg-rose-100" : "hover:bg-black/5",
      )}
    >
      <Link
        href={Routes.projectList()}
        className={clsx(
          "w-full py-2 pl-2 text-start font-bold",
          active ? "text-rose-700" : "text-stone-500",
        )}
      >
        マイプロジェクト
      </Link>
      <div
        className={clsx(
          "group flex h-full items-center gap-1 pr-2 opacity-0 group-hover/sidebar:opacity-100 focus-within:opacity-100 has-[*[data-open]]:opacity-100",
        )}
      >
        <Menu
          trigger={
            <IconButton>
              <Icon icon={PiPlusLight} />
            </IconButton>
          }
        >
          <MenuButtonItem
            icon={PiHashLight}
            label="プロジェクトを追加"
            description="タスクを計画&アサイン"
            onClick={() => setIsCreateDialogOpen(true)}
          />
          <MenuButtonItem
            icon={PiBrowsersLight}
            label="テンプレートを見る"
            description="プロジェクトテンプレートで始める"
          />
        </Menu>
        <ProjectCreateDialog
          createType="default"
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
        {projectsCount ? (
          <TreeToggleIconButton isOpen={isOpen} onOpenChange={onOpenChange} />
        ) : null}
      </div>
    </div>
  );
};
