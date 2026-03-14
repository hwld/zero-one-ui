import { Command } from "cmdk";
import {
  UsersIcon,
  ChevronDownSquareIcon,
  BookMarkedIcon,
  MilestoneIcon,
  XIcon,
} from "lucide-react";
import { forwardRef } from "react";
import { SelectionMenu } from "../../selection-menu/menu";
import { ConfigMenuItem } from "./item";

type Props = {
  onBack: () => void;
};
export const GroupByConfigMenu = forwardRef<HTMLDivElement, Props>(function GroupByConfigMenu(
  { onBack },
  ref,
) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Group by...">
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem icon={ChevronDownSquareIcon} title="Status" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem icon={BookMarkedIcon} title="repository" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem icon={MilestoneIcon} title="Milestone" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="no grouping">
        <ConfigMenuItem icon={XIcon} title="No grouping" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});
