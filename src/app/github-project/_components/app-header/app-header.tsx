import {
  ChevronDown,
  CircleDotIcon,
  GitPullRequestIcon,
  InboxIcon,
  PlusIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react";
import { AppDrawer } from "../app-drawer/app-drawer";
import { BreadCrumbItem, BreadCrumbSeparator } from "../bread-crumb";
import { Logo } from "../logo";
import { HeaderButton } from "./button";
import { Tooltip } from "../tooltip";
import { CreateNewMenuTrigger } from "./create-new-menu-trigger";
import { UserDrawer } from "../user-drawer/user-drawer";

export const appHeaderHeightPx = "64px";

export const AppHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-600 px-4">
      <div className="flex items-center gap-4">
        <AppDrawer />
        <Logo />
        <div className="flex items-center">
          <BreadCrumbItem>hwld</BreadCrumbItem>
          <BreadCrumbSeparator />
          <BreadCrumbItem>projects</BreadCrumbItem>
          <BreadCrumbSeparator />
          <BreadCrumbItem active>zero-one-ui</BreadCrumbItem>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-[350px] cursor-pointer items-center justify-between rounded-md border border-neutral-600 px-2 text-neutral-400">
          <div className="flex items-center gap-2">
            <SearchIcon size={16} />
            <div className="text-sm">
              Type
              <kbd className="mx-1 rounded-sm border border-neutral-400 px-[3px]">
                /
              </kbd>
              to search
            </div>
          </div>
          <div className="flex h-full items-center gap-2">
            <div className="h-2/3 w-px bg-neutral-600" />
            <TerminalIcon size={16} />
          </div>
        </button>
        <div className="h-5 w-px bg-neutral-600" />
        <CreateNewMenuTrigger>
          <HeaderButton icon={PlusIcon} rightIcon={ChevronDown} />
        </CreateNewMenuTrigger>
        <Tooltip label="Issues">
          <HeaderButton icon={CircleDotIcon} />
        </Tooltip>
        <Tooltip label="Pull requests">
          <HeaderButton icon={GitPullRequestIcon} />
        </Tooltip>
        <Tooltip label="You have no unread notifications">
          <HeaderButton icon={InboxIcon} />
        </Tooltip>
        <UserDrawer />
      </div>
    </div>
  );
};
