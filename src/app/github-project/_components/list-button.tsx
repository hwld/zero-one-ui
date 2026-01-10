import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { IconComponent } from "./icon";

type ListButtonBaseProps = {
  red?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const ListButtonBase = forwardRef<
  HTMLButtonElement,
  ListButtonBaseProps
>(function ListButton({ red, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        "h-8 w-full cursor-pointer rounded-md px-2 transition-colors focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
        red
          ? "text-red-500 hover:bg-red-500/15 focus-visible:bg-red-500/15"
          : "text-neutral-100 hover:bg-white/15 focus-visible:bg-white/15",
      )}
    >
      {children}
    </button>
  );
});

type ListButtonContentProps = {
  icon?: IconComponent;
  label: string;
  red?: boolean;
  rightIcon?: React.FC<{
    size?: number | string | undefined;
    className?: string;
  }>;
};

export const ListButtonContent: React.FC<ListButtonContentProps> = ({
  icon: Icon,
  red,
  label,
  rightIcon: RightIcon,
}) => {
  return (
    <div className="flex size-full items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={16}
            className={clsx("text-neutral-400", red && "text-red-500")}
          />
        )}
        <div className="text-sm">{label}</div>
      </div>
      {RightIcon && <RightIcon size={16} className="text-neutral-400" />}
    </div>
  );
};

type ListButtonProps = ListButtonBaseProps & ListButtonContentProps;

export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  function ListButton({ red, icon, label, rightIcon, ...props }, ref) {
    return (
      <ListButtonBase ref={ref} red={red} {...props}>
        <ListButtonContent
          icon={icon}
          label={label}
          red={red}
          rightIcon={rightIcon}
        />
      </ListButtonBase>
    );
  },
);
