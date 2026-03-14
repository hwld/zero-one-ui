import { ArchiveIcon, TrashIcon, Settings2Icon, PenIcon, EyeOffIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { TaskStatus } from "../_backend/task-status/store";
import { Divider } from "./divider";
import { DropdownCard } from "./dropdown/card";
import { DropdownContent } from "./dropdown/content";
import { DropdownItemGroup, DropdownItem } from "./dropdown/item";
import { DropdownProvider } from "./dropdown/provider";
import { DropdownTrigger } from "./dropdown/trigger";
import { Tooltip } from "./tooltip";

type Props = {
  status: TaskStatus;
  children: ReactNode;
};

export const ViewColumnMenuTrigger: React.FC<Props> = ({ status, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-end">
      <Tooltip label={`Actions for column: ${status.name}`}>
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemGroup group="Items">
            <DropdownItem icon={ArchiveIcon} label="Archive all" />
            <DropdownItem icon={TrashIcon} label="Delete all" red />
          </DropdownItemGroup>
          <Divider />
          <DropdownItemGroup group="Column">
            <DropdownItem icon={Settings2Icon} label="Set limit" />
            <DropdownItem icon={PenIcon} label="Edit details" />
            <DropdownItem icon={EyeOffIcon} label="Hide from view" />
            <DropdownItem icon={TrashIcon} label="Delete" red />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
