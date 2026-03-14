import { LucideIcon, CheckIcon } from "lucide-react";
import { forwardRef } from "react";
import { ListButton } from "../../list-button";
import { IconComponent } from "../../icon";

type Props = { icon?: LucideIcon; title: string; isSelected: boolean };

export const ConfigMenuItem = forwardRef<HTMLButtonElement, Props>(function ConfigMenuItem(
  { icon: Icon, title, isSelected, ...props },
  ref,
) {
  return (
    <ListButton
      ref={ref}
      {...props}
      icon={Icon}
      label={title}
      rightIcon={isSelected ? SelectedIcon : undefined}
    />
  );
});

const SelectedIcon: IconComponent = () => {
  return <CheckIcon size={20} className="text-neutral-100" />;
};
