import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import { IconType } from "@react-icons/all-files/lib";

const mutedTextClass = "text-stone-500";
const activeTextClass = "text-rose-700";
const wrapperChildClass =
  "flex h-full w-full items-center pl-(--padding-x) overflow-hidden";

type WrapperProps = {
  active?: boolean;
  isDragging?: boolean;
  right?: ReactNode;
  children: ReactNode;
  depth?: number;
} & ComponentPropsWithoutRef<"div">;

// buttonやa要素の中にbuttonやa要素を含めることができないので、一つ上にWrapperを作って、兄弟としてレンダリングする
const ItemWrapper: React.FC<WrapperProps> = ({
  right,
  active,
  isDragging,
  children,
  depth = 0,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex h-9 items-center justify-between rounded-sm transition-colors",
        active ? clsx("bg-rose-100", activeTextClass) : "hover:bg-black/5",
        isDragging && "outline-2 outline-rose-400 outline-dashed",
      )}
      style={{
        ["--padding-x" as string]: "8px",
        marginLeft: `${16 * depth}px`,
      }}
    >
      {children}
      {right && (
        <span
          className={clsx(
            "pr-(--padding-x) pl-1",
            active ? activeTextClass : mutedTextClass,
          )}
        >
          {right}
        </span>
      )}
    </div>
  );
};

type ContentProps = {
  icon: IconType;
  active?: boolean;
  children: ReactNode;
};

const ItemContent: React.FC<ContentProps> = ({
  icon: Icon,
  active,
  children,
}) => {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="grid size-7 shrink-0 place-items-center">
        <Icon
          className={clsx(
            "size-6 shrink-0",
            active ? activeTextClass : mutedTextClass,
          )}
        />
      </span>
      <div className="truncate">{children}</div>
    </span>
  );
};

type ListButtonProps = {
  icon: IconType;
  right?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
  isDragging?: boolean;
  depth?: number;
};

export const SidebarListButton = forwardRef<HTMLLIElement, ListButtonProps>(
  function SidebarListButton(
    { icon, right, children, isDragging, depth, ...props },
    ref,
  ) {
    return (
      <li ref={ref}>
        <ItemWrapper right={right} isDragging={isDragging} depth={depth}>
          <button {...props} className={wrapperChildClass}>
            <ItemContent icon={icon}>{children}</ItemContent>
          </button>
        </ItemWrapper>
      </li>
    );
  },
);

type ListLinkProps = LinkProps & {
  icon: IconType;
  right?: ReactNode;
  children: ReactNode;
  activeIcon?: IconType;
  currentRoute: string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  depth?: number;

  isDragging?: boolean;
  isAnyDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.PointerEvent) => void;
  onDragLeave?: () => void;
  onDragEnter?: () => void;
} & Omit<ComponentPropsWithoutRef<"a">, "onPointerEnter" | "onPointerLeave">;

export const SidebarListLink = forwardRef<HTMLLIElement, ListLinkProps>(
  function SidebarListLink(
    {
      icon,
      activeIcon,
      currentRoute,
      right,
      children,
      onPointerEnter,
      onPointerLeave,
      depth,
      isDragging,
      isAnyDragging,
      onDragStart,
      onDragOver,
      onDragLeave,
      onDragEnter,
      ...props
    },
    ref,
  ) {
    const active = currentRoute === props.href;
    const actualIcon = (active ? activeIcon : icon) ?? icon;

    return (
      <li
        ref={ref}
        onPointerMove={(e) => {
          if (isAnyDragging) {
            onDragOver?.(e);
          }
        }}
        onDragStart={(e) => {
          e.preventDefault();
          onDragStart?.(e);
        }}
        onPointerLeave={(e) => {
          e.preventDefault();
          if (isAnyDragging) {
            onDragLeave?.();
          }
        }}
        onPointerEnter={() => {
          if (isAnyDragging) {
            onDragEnter?.();
          }
        }}
      >
        <ItemWrapper
          active={active}
          isDragging={isDragging}
          right={right}
          depth={depth}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        >
          <Link {...props} className={wrapperChildClass}>
            <ItemContent icon={actualIcon} active={active}>
              {children}
            </ItemContent>
          </Link>
        </ItemWrapper>
      </li>
    );
  },
);
