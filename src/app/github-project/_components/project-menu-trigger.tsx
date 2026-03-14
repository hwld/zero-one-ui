import { ReactNode, useState } from "react";
import { DropdownProvider } from "./dropdown/provider";
import { Tooltip } from "./tooltip";
import { DropdownTrigger } from "./dropdown/trigger";
import { DropdownCard } from "./dropdown/card";
import { DropdownContent } from "./dropdown/content";
import { DropdownItem, DropdownItemGroup, DropdownItemList } from "./dropdown/item";
import {
  ArchiveIcon,
  BookOpenIcon,
  CopyIcon,
  MessageSquareIcon,
  RocketIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";
import { Divider } from "./divider";

type Props = { children: ReactNode };
export const ProjectMenuTrigger: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <Tooltip label="View more options">
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemList>
            <DropdownItem icon={WorkflowIcon} label="Workflows" />
            <DropdownItem icon={ArchiveIcon} label="Archived items" />
            <DropdownItem icon={SettingsIcon} label="Settings" />
            <DropdownItem icon={CopyIcon} label="Make a copy" />
          </DropdownItemList>
          <Divider />
          <DropdownItemGroup group="GitHub Projects">
            <DropdownItem icon={RocketIcon} label="What's new" />
            <DropdownItem icon={MessageSquareIcon} label="Give feedback" />
            <DropdownItem icon={BookOpenIcon} label="GitHub Docs" />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
