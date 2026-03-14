import { Command } from "cmdk";
import {
  BookMarkedIcon,
  ChevronDownSquareIcon,
  GitPullRequestIcon,
  ListIcon,
  MilestoneIcon,
  PlusIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";
import { forwardRef } from "react";
import { SelectionMenu } from "../../selection-menu/menu";
import { ConfigMenuItem } from "./item";

type Props = {
  onBack: () => void;
};

export const FieldsConfigMenu = forwardRef<HTMLDivElement, Props>(function FieldsConfigMenu(
  { onBack },
  ref,
) {
  return (
    <SelectionMenu
      ref={ref}
      header={
        <button className="mx-2 flex h-8 items-center gap-2 rounded-md px-2 transition-colors hover:bg-white/15">
          <PlusIcon size={16} />
          <div className="text-sm">New field</div>
        </button>
      }
      onBack={onBack}
      placeholder="Fields..."
    >
      <Command.Item asChild key="title">
        <ConfigMenuItem icon={ListIcon} title="Title" isSelected={true} />
      </Command.Item>
      <Command.Item asChild key="assignees">
        <ConfigMenuItem icon={UsersIcon} title="Assignees" isSelected={true} />
      </Command.Item>
      <Command.Item asChild key="status">
        <ConfigMenuItem icon={ChevronDownSquareIcon} title="Status" isSelected={true} />
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
    </SelectionMenu>
  );
});
