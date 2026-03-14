import { ChevronDownSquareIcon } from "lucide-react";
import { forwardRef } from "react";
import { SelectionMenu } from "../../selection-menu/menu";
import { ConfigMenuItem } from "./item";
import { Command } from "cmdk";

export const ColumnByConfigMenu = forwardRef<
  HTMLDivElement,
  {
    onBack: () => void;
  }
>(function ColumnByConfigMenu({ onBack }, ref) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Column by...">
      <Command.Item asChild key="status">
        <ConfigMenuItem icon={ChevronDownSquareIcon} title="Status" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});
