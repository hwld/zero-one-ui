import clsx from "clsx";
import { AnimatePresence, motion, MotionConfig, Variants } from "motion/react";
import {
  createContext,
  KeyboardEvent,
  ReactNode,
  SyntheticEvent,
  useContext,
  useState,
} from "react";

import {
  getFirstFocusableId,
  getLastFocusableId,
  getNextFocusableId,
  getNextFocusableIdByTypeahead,
  getParentFocusableId,
  getPrevFocusableId,
  RovingTabindexItem,
  RovingTabindexRoot,
  useRovingTabindex,
} from "./roving-tabindex";
import { cn } from "../../../lib/utils";

type NodeStates = Map<string, boolean>;

type TreeViewContextType = {
  nodeStates: NodeStates;
  toggleNode: (id: string, isOpen: boolean) => void;
  selectedId: string | null;
  selectId: (id: string) => void;
  expandOnlyOnIconClick: boolean;
};

const TreeViewContext = createContext<TreeViewContextType | undefined>(
  undefined,
);

const useTreeViewContext = () => {
  const ctx = useContext(TreeViewContext);
  if (!ctx) {
    throw new Error("TreeViewContextが存在しません");
  }
  return ctx;
};

const useTreeViewNodeState = () => {
  const [nodeStates, setNodeStates] = useState<NodeStates>(new Map());

  const toggleNode = (id: string, isOpen: boolean) => {
    setNodeStates((map) => {
      return new Map(map).set(id, isOpen);
    });
  };

  return { nodeStates, toggleNode };
};

type TreeViewProps = {
  children: ReactNode | ReactNode[];
  className?: string;
  value: string | null;
  onChange: (id: string) => void;
  label?: string;
  expandOnlyOnIconClick?: boolean;
};

export const TreeView: React.FC<TreeViewProps> = ({
  children,
  className,
  value,
  onChange,
  label,
  expandOnlyOnIconClick = false,
}) => {
  const { nodeStates, toggleNode } = useTreeViewNodeState();

  return (
    <TreeViewContext.Provider
      value={{
        nodeStates,
        toggleNode,
        selectedId: value,
        selectId: onChange,
        expandOnlyOnIconClick,
      }}
    >
      <RovingTabindexRoot
        as="ul"
        className={clsx("flex flex-col overflow-auto", className)}
        aria-label={label}
        aria-multiselectable="false"
        role="tree"
      >
        {children}
      </RovingTabindexRoot>
    </TreeViewContext.Provider>
  );
};

export type TreeNodeType = {
  id: string;
  name: string;
  children?: TreeNodeType[];
  icon?: ReactNode;
};

type IconProps = { open?: boolean; className?: string };

function Arrow({ open, className }: IconProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={clsx("origin-center", className)}
      animate={{ rotate: open ? 90 : 0 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </motion.svg>
  );
}
const treeAnimation: Variants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.25,
      },
      opacity: {
        duration: 0.2,
        delay: 0.05,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.25,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

export type TreeViewNodeProps = {
  node: TreeNodeType;
  classNames: {
    selected: string;
    groupFocus: string;
    hover: string;
    hoverIcon?: string;
  };
};

export const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  classNames,
  node: { id, children, name },
}) => {
  const {
    nodeStates,
    toggleNode,
    selectId,
    selectedId,
    expandOnlyOnIconClick,
  } = useTreeViewContext();
  const { isFocusable, getRovingProps, getOrderedItems } =
    useRovingTabindex(id);
  const isOpen = nodeStates.get(id);

  const handleClickNode = () => {
    if (!expandOnlyOnIconClick) {
      toggleNode(id, !isOpen);
    }
    selectId(id);
  };

  const handleClickIcon = (e: SyntheticEvent) => {
    if (expandOnlyOnIconClick) {
      e.stopPropagation();
      toggleNode(id, !isOpen);
    }
  };

  return (
    <li
      {...getRovingProps<"li">({
        className:
          "flex flex-col cursor-pointer select-none focus:outline-hidden group",
        onKeyDown: function (e: KeyboardEvent) {
          e.stopPropagation();

          const items = getOrderedItems();
          let nextItemToFocus: RovingTabindexItem | undefined;

          if (e.key === "ArrowUp") {
            e.preventDefault();
            nextItemToFocus = getPrevFocusableId(items, id);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            nextItemToFocus = getNextFocusableId(items, id);
          } else if (e.key === "ArrowLeft") {
            if (isOpen && children?.length) {
              toggleNode(id, false);
            } else {
              nextItemToFocus = getParentFocusableId(items, id);
            }
          } else if (e.key === "ArrowRight") {
            if (isOpen && children?.length) {
              nextItemToFocus = getNextFocusableId(items, id);
            } else {
              toggleNode(id, true);
            }
          } else if (e.key === "Home") {
            e.preventDefault();
            nextItemToFocus = getFirstFocusableId(items);
          } else if (e.key === "End") {
            e.preventDefault();
            nextItemToFocus = getLastFocusableId(items);
          } else if (/^[a-z]$/i.test(e.key)) {
            nextItemToFocus = getNextFocusableIdByTypeahead(items, id, e.key);
          } else if (e.key === " ") {
            e.preventDefault();
            selectId(id);
          }
          nextItemToFocus?.element.focus();
        },
        ["aria-expanded"]: children?.length ? Boolean(isOpen) : undefined,
        ["aria-selected"]: selectedId === id,
        role: "treeitem",
      })}
    >
      <MotionConfig
        transition={{
          ease: [0.164, 0.84, 0.43, 1],
          duration: 0.25,
        }}
      >
        <div
          className={clsx(
            "overflow-hidden rounded-sm transition-colors duration-75",
            selectedId === id ? classNames.selected : "bg-transparent",
          )}
        >
          <div
            className={clsx(
              "rounded-sm border border-transparent transition-colors duration-75",
              isFocusable && classNames.groupFocus,
            )}
          >
            <div
              className={cn(
                "flex items-center px-1 font-mono font-medium transition-colors duration-75",
                classNames.hover,
              )}
              onClick={handleClickNode}
            >
              {children?.length ? (
                <button
                  className={clsx(
                    "grid size-5 shrink-0 place-items-center rounded-sm transition-all duration-75",
                    expandOnlyOnIconClick && classNames.hoverIcon,
                  )}
                  onClick={handleClickIcon}
                >
                  <Arrow className="size-4 shrink-0" open={isOpen} />
                </button>
              ) : (
                <span className="size-5" />
              )}
              <span className="grow truncate pl-2">
                {name}
              </span>
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {children?.length && isOpen && (
            <motion.ul
              {...treeAnimation}
              key={"ul"}
              role="group"
              className="relative pl-4"
            >
              {children.map((node) => (
                <TreeViewNode
                  classNames={classNames}
                  node={node}
                  key={node.id}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </MotionConfig>
    </li>
  );
};
