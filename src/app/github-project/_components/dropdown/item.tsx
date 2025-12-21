import { LucideIcon } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactNode,
  forwardRef,
} from "react";
import { useDropdown } from "./provider";
import { useListItem, useMergeRefs } from "@floating-ui/react";
import { ListButtonBase, ListButtonContent } from "../list-button";

type DropdownItemGroupProps = { group: string; children: ReactNode };
export const DropdownItemGroup: React.FC<DropdownItemGroupProps> = ({
  group,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="px-4 pt-2 pb-1 text-xs text-neutral-400">{group}</div>
      <DropdownItemList>{children}</DropdownItemList>
    </div>
  );
};

type DropdownItemListProps = { children: ReactNode };
export const DropdownItemList: React.FC<DropdownItemListProps> = ({
  children,
}) => {
  return <div className="px-2">{children}</div>;
};

type DropdownItemBaseProps = {
  red?: boolean;
} & PropsWithChildren &
  ComponentPropsWithoutRef<"button">;

export const DropdownItemBase = forwardRef<
  HTMLButtonElement,
  DropdownItemBaseProps
>(function DropdownItemBase({ children, ...props }, outerRef) {
  const { activeIndex } = useDropdown();
  const { ref, index } = useListItem();
  const isActive = activeIndex === index;

  const mergedRef = useMergeRefs([outerRef, ref]);

  return (
    <ListButtonBase ref={mergedRef} {...props} tabIndex={isActive ? 0 : -1}>
      {children}
    </ListButtonBase>
  );
});

type DropdownItemProps = {
  icon: LucideIcon;
  label: string;
  red?: boolean;
  rightIcon?: LucideIcon;
} & ComponentPropsWithoutRef<"button">;

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem({ icon, label, red, rightIcon, ...props }, ref) {
    return (
      <DropdownItemBase ref={ref} {...props} red={red}>
        <ListButtonContent
          red={red}
          icon={icon}
          label={label}
          rightIcon={rightIcon}
        />
      </DropdownItemBase>
    );
  },
);
