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
import { Command } from "cmdk";

type Props = {
  onBack: () => void;
};

export const SliceByConfigMenu = forwardRef<HTMLDivElement, Props>(function SliceByConfigMenu(
  { onBack },
  ref,
) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Slice by...">
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem icon={ChevronDownSquareIcon} title="Status" isSelected={true} />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem icon={BookMarkedIcon} title="repository" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem icon={MilestoneIcon} title="Milestone" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="no grouping">
        <ConfigMenuItem icon={XIcon} title="No slicing" isSelected={false} />
      </Command.Item>
    </SelectionMenu>
  );
});
