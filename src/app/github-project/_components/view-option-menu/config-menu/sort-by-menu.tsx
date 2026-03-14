import { Command } from "cmdk";
import {
  ListIcon,
  UsersIcon,
  ChevronDownSquareIcon,
  TagIcon,
  GitPullRequestIcon,
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
export const SortByConfigMenu = forwardRef<HTMLDivElement, Props>(function SortByConfigMenu(
  { onBack },
  ref,
) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Sort by...">
      <Command.Item asChild key="title">
        <ConfigMenuItem icon={ListIcon} title="Title" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem icon={ChevronDownSquareIcon} title="Status" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="labels">
        <ConfigMenuItem icon={TagIcon} title="Labels" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="linked pull requests">
        <ConfigMenuItem icon={GitPullRequestIcon} title="Linked pull requests" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="reviewers">
        <ConfigMenuItem icon={UsersIcon} title="Reviewers" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="repository">
        <ConfigMenuItem icon={BookMarkedIcon} title="repository" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="milestone">
        <ConfigMenuItem icon={MilestoneIcon} title="Milestone" isSelected={false} />
      </Command.Item>
      <Command.Item asChild key="no sorting">
        <ConfigMenuItem icon={XIcon} title="No sorting" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});
