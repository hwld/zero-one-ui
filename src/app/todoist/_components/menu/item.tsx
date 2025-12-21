import { useListItem, useFloatingTree, useMergeRefs } from "@floating-ui/react";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useContext,
} from "react";
import { IconType } from "@react-icons/all-files/lib/iconBase";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { MenuContext } from "./menu";
import { PiCaretRightBold } from "@react-icons/all-files/pi/PiCaretRightBold";
import { cn } from "../../../../lib/utils";
import { Tooltip } from "../tooltip";

type ContentProps = {
  icon: IconType;
  label: ReactNode;
  description?: string;
  right?: ReactNode;
  variant?: "destructive" | "green" | "default";
};

const MenuItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  label,
  description,
  right,
  variant = "default",
}) => {
  const variantClass = {
    destructive: "text-red-700",
    green: "bg-green-500/10 text-green-700",
    default: "",
  };

  return (
    <div
      className={clsx(
        "flex min-h-8 items-center justify-between gap-2 px-2",
        description && "py-2",
        variantClass[variant],
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon className={clsx("size-5", description && "self-start")} />
        <div className="flex min-w-0 flex-col items-start gap-1">
          <div
            className={clsx(
              "flex w-full items-start truncate text-nowrap",
              description && "font-bold",
            )}
          >
            {label}
          </div>
          {description ? (
            <div className="text-xs text-stone-500">{description}</div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center text-xs text-stone-500">{right}</div>
    </div>
  );
};

type MenuItemWrapperProps = {
  children: ReactNode;
  className: string;
};

const MenuItemWrapper = forwardRef<HTMLButtonElement, MenuItemWrapperProps>(
  function MenuItem({ children, className, ...props }, forwardedRef) {
    const menu = useContext(MenuContext);
    const item = useListItem();
    const tree = useFloatingTree();
    const isActive = item.index === menu.activeIndex;

    return (
      <Slot
        ref={useMergeRefs([item.ref, forwardedRef])}
        role="menuitem"
        className={className}
        tabIndex={isActive ? 0 : -1}
        {...menu.getItemProps({
          onClick() {
            tree?.events.emit("click");
          },
          onFocus() {
            menu.setHasFocusInside(true);
          },
        })}
        {...props}
      >
        {children}
      </Slot>
    );
  },
);

const wideItemClass = "mx-2 rounded-sm focus:bg-black/5 focus:outline-hidden";

type ButtonItemProps = ContentProps & ComponentPropsWithoutRef<"button">;

export const MenuButtonItem = forwardRef<HTMLButtonElement, ButtonItemProps>(
  function MenuButtonItem(
    { icon, label, description, right, variant, ...props },
    ref,
  ) {
    return (
      <MenuItemWrapper className={wideItemClass}>
        <button ref={ref} {...props}>
          <MenuItemContent
            icon={icon}
            label={label}
            description={description}
            right={right}
            variant={variant}
          />
        </button>
      </MenuItemWrapper>
    );
  },
);

type LinkItemProps = ContentProps & LinkProps;

export const MenuLinkItem: React.FC<LinkItemProps> = ({
  icon,
  label,
  description,
  right,
  variant,
  ...props
}) => {
  return (
    <MenuItemWrapper className={wideItemClass}>
      <Link {...props}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          right={right}
          variant={variant}
        />
      </Link>
    </MenuItemWrapper>
  );
};

type SubMenuTrigger = Omit<ContentProps, "right"> &
  ComponentPropsWithoutRef<"button">;

export const SubMenuTrigger = forwardRef<HTMLButtonElement, SubMenuTrigger>(
  function SubMenuTrigger(
    { icon, label, description, className, variant, ...props },
    ref,
  ) {
    return (
      <button ref={ref} {...props} className={cn(className, wideItemClass)}>
        <MenuItemContent
          icon={icon}
          label={label}
          description={description}
          variant={variant}
          right={<PiCaretRightBold />}
        />
      </button>
    );
  },
);

type _MenuIconButtonItemProps = {
  icon: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

const _MenuIconButtonItem = forwardRef<
  HTMLButtonElement,
  _MenuIconButtonItemProps
>(function MenuIconButtonItem({ icon, className, ...props }, ref) {
  return (
    <MenuItemWrapper
      className={cn(
        "grid size-8 place-items-center rounded-sm border border-stone-200 focus:bg-black/5 focus:outline-hidden",
        className,
      )}
    >
      <button ref={ref} {...props}>
        {icon}
      </button>
    </MenuItemWrapper>
  );
});

export const MenuIconButtonItem: React.FC<
  _MenuIconButtonItemProps & { label: string }
> = ({ label, ...props }) => {
  return (
    // MenuIconButtonItemをTooltipDelayGroupでラップしても意図した挙動にはならない。
    // これは、TooltipのDelayはBlurでリセットされるためだと思う。
    // MenuItemはホバーしたときにfocusイベントが発生するので、
    // ホバーを外したときにBlurが動いてしまい、delyaがリセットされる
    // 妥協してopenのdelayを0にする
    <Tooltip label={label} placement="top" delay={{ open: 0 }}>
      <_MenuIconButtonItem {...props} />
    </Tooltip>
  );
};
