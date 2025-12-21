import { useState } from "react";
import { Drawer } from "../drawer/drawer";
import {
  CircleDotIcon,
  ComputerIcon,
  GiftIcon,
  GitPullRequestIcon,
  HomeIcon,
  MenuIcon,
  MessagesSquareIcon,
  PanelsTopLeftIcon,
  SearchIcon,
  TelescopeIcon,
  XIcon,
} from "lucide-react";
import { Logo } from "../logo";
import { Divider } from "../divider";
import { HeaderButton } from "../app-header/button";
import { Avatar } from "../avatar";
import { IconButton } from "../icon-button";
import { ListButton } from "../list-button";

export const AppDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="left"
      trigger={<HeaderButton icon={MenuIcon} />}
    >
      <div className="flex w-full items-center justify-between px-4 pt-4 pb-2">
        <Logo />
        <IconButton icon={XIcon} onClick={() => setIsOpen(false)} />
      </div>
      <div className="min-w-0 grow space-y-2 overflow-auto px-4 pt-2">
        <div>
          <ListButton icon={HomeIcon} label="Home" />
          <ListButton icon={CircleDotIcon} label="Issues" />
          <ListButton icon={GitPullRequestIcon} label="Pull requests" />
          <ListButton icon={PanelsTopLeftIcon} label="Projects" />
          <ListButton icon={MessagesSquareIcon} label="Discussions" />
          <ListButton icon={ComputerIcon} label="Codespaces" />
        </div>
        <Divider />
        <div>
          <ListButton icon={TelescopeIcon} label="Explore" />
          <ListButton icon={GiftIcon} label="Marketplace" />
        </div>
        <Divider />
        <div>
          <div className="flex items-center justify-between text-neutral-400">
            <div className="p-2 text-xs font-bold">Repositories</div>
            <IconButton icon={SearchIcon} />
          </div>
          <div>
            <ListButton icon={Avatar} label="hwld/aluep" />
            <ListButton icon={Avatar} label="hwld/evodo-openapi" />
            <ListButton icon={Avatar} label="hwld/evodo-axum" />
            <ListButton icon={Avatar} label="hwld/zero-one-ui" />
            <ListButton icon={Avatar} label="hwld/evodo-graphql" />
            <button className="flex h-8 w-full items-center rounded-md px-2 text-xs text-neutral-400 transition-colors hover:bg-white/15">
              Show more
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
