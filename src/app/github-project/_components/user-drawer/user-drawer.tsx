import { useState } from "react";
import { Drawer } from "../drawer/drawer";
import { Avatar } from "../avatar";
import {
  BookMarkedIcon,
  BuildingIcon,
  CodeSquareIcon,
  ComputerIcon,
  FlaskConicalIcon,
  GlobeIcon,
  HeartIcon,
  KanbanSquareIcon,
  MessagesSquareIcon,
  SettingsIcon,
  SmileIcon,
  StarIcon,
  UploadIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Divider } from "../divider";
import { IconButton } from "../icon-button";
import { ListButton } from "../list-button";
import { IconComponent } from "../icon";

export const UserDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="right"
      trigger={
        <button>
          <Avatar />
        </button>
      }
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar />
            <div>
              <div className="text-sm font-bold">hwld</div>
              <div className="text-sm text-neutral-400">hwld</div>
            </div>
          </div>
          <div className="self-start">
            <IconButton icon={XIcon} onClick={() => setIsOpen(false)} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <ListButton icon={SmileIcon} label="Set status" />
          <Divider />
          <div>
            <ListButton icon={UserIcon} label="Your profile" />
            <ListButton icon={UserPlusIcon} label="Add account" />
          </div>
          <Divider />
          <div>
            <ListButton icon={BookMarkedIcon} label="Your repositories" />
            <ListButton icon={KanbanSquareIcon} label="Your projects" />
            <ListButton icon={ComputerIcon} label="Your Copilot" />
            <ListButton icon={BuildingIcon} label="Your organizations" />
            <ListButton icon={GlobeIcon} label="Your enterprises" />
            <ListButton icon={StarIcon} label="Your stars" />
            <ListButton icon={HeartIcon} label="Your sponsors" />
            <ListButton icon={CodeSquareIcon} label="Your gists" />
          </div>
          <Divider />
          <div>
            <ListButton icon={UploadIcon} label="Upgrade" />
            <ListButton icon={GlobeIcon} label="Try Enterprise" rightIcon={FreeBadgeIcon} />
            <ListButton icon={FlaskConicalIcon} label="Feature preview" />
            <ListButton icon={SettingsIcon} label="Settings" />
          </div>
          <Divider />
          <div>
            <ListButton icon={UsersIcon} label="GitHub Support" />
            <ListButton icon={MessagesSquareIcon} label="GitHub Community" />
          </div>
          <Divider />
          <div>
            <ListButton label="Sign out" />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const FreeBadgeIcon: IconComponent = () => {
  return (
    <span className="flex h-5 items-center rounded-full border border-neutral-400 px-2 text-xs">
      Free
    </span>
  );
};
