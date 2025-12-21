import clsx from "clsx";
import { KanbanSquareIcon, LucideIcon } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ViewOptionMenuTrigger } from "./view-option-menu/trigger";
import { ViewSummary } from "../_backend/view/api";

type ViewTabProps = {
  icon?: LucideIcon;
  children: ReactNode;
  interactive?: boolean;
  rightIcon?: ReactNode;
};

const ViewTabContent: React.FC<ViewTabProps> = ({
  icon: Icon = KanbanSquareIcon,
  children,
  interactive = true,
  rightIcon,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (!contentRef.current) {
      return;
    }
    const content = contentRef.current;

    const observer = new ResizeObserver(() => {
      const parent = content.parentElement;
      if (!parent) {
        return;
      }

      const isOverflow = content.clientWidth > parent.clientWidth;
      setIsOverflow(isOverflow);
    });

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={clsx(
        "flex w-full items-center gap-3 overflow-hidden rounded-md border-2 border-transparent px-2 py-[6px] transition-colors group-focus-visible:border-blue-300",
        interactive
          ? "text-neutral-400 group-hover:bg-neutral-700 group-hover:text-neutral-100"
          : "text-neutral-100",
      )}
    >
      <div className={clsx("flex items-center gap-2 overflow-hidden")}>
        <Icon size={16} className="shrink-0" />
        <div
          className={clsx(
            "w-full min-w-0 text-sm whitespace-nowrap",
            isOverflow &&
              "bg-linear-to-r from-neutral-400 from-85% to-transparent bg-clip-text text-transparent group-hover:from-neutral-100",
          )}
        >
          {children}
        </div>

        {/* テキストがoverflowしているかを判定するために使用する */}
        <div
          ref={contentRef}
          className="invisible fixed top-full text-sm"
          aria-hidden
        >
          {children}
        </div>
      </div>
      {rightIcon}
    </div>
  );
};

const viewTabWrapperClass = (active: boolean = false) =>
  clsx(
    "group relative flex min-w-[100px] shrink-0 items-start gap-1 border-x border-t px-1 focus-visible:outline-hidden",
    active
      ? "rounded-t-md border-neutral-600 bg-neutral-800 text-neutral-100"
      : "max-w-[200px] rounded-md border-transparent",
  );

type ViewTabButtonProps = ViewTabProps & { active?: boolean } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className"
  >;

export const ViewTabButton = forwardRef<HTMLButtonElement, ViewTabButtonProps>(
  function ViewTabButton({ icon, children, ...props }, ref) {
    return (
      <button ref={ref} {...props} className={viewTabWrapperClass(false)}>
        <ViewTabContent icon={icon}>{children}</ViewTabContent>
      </button>
    );
  },
);

type ViewTabLinkProps = ViewTabProps & {
  href: string;
  active?: boolean;
  viewSummary: ViewSummary;
};

export const ViewTabLink: React.FC<ViewTabLinkProps> = ({
  href,
  viewSummary,
  icon,
  active = false,
  children,
}) => {
  const Wrapper = active ? "div" : Link;

  return (
    <Wrapper href={href} className={viewTabWrapperClass(active)}>
      <ViewTabContent
        icon={icon}
        interactive={!active}
        rightIcon={
          active && <ViewOptionMenuTrigger viewSummary={viewSummary} />
        }
      >
        {children}
        {active && (
          <>
            <OuterBottomCorner position="right" />
            <OuterBottomCorner position="left" />
          </>
        )}
      </ViewTabContent>
    </Wrapper>
  );
};

const OuterBottomCorner: React.FC<{
  position: "left" | "right";
}> = ({ position }) => {
  const positionClass = {
    left: "right-full before:rounded-br-[8px] before:border-r",
    right: "left-full before:rounded-bl-[8px] before:border-l",
  };

  return (
    <div
      className={clsx(
        "corner absolute bottom-0 size-2 bg-neutral-800 before:absolute before:top-0 before:left-0 before:size-2 before:border-b before:border-neutral-600 before:bg-neutral-900 before:content-['']",
        positionClass[position],
      )}
    />
  );
};
