import { Command } from "cmdk";
import { forwardRef } from "react";
import { SelectionMenu } from "../../selection-menu/menu";
import { ConfigMenuItem } from "./item";

type Props = {
  onBack: () => void;
};
export const FieldSumConfigMenu = forwardRef<HTMLDivElement, Props>(function FieldSumConfigMenu(
  { onBack },
  ref,
) {
  return (
    <SelectionMenu ref={ref} onBack={onBack} placeholder="Field sum...">
      <Command.Item asChild key="count">
        <ConfigMenuItem title="Count" isSelected={true} />
      </Command.Item>
    </SelectionMenu>
  );
});
