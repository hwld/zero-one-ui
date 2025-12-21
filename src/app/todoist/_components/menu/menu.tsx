//https://codesandbox.io/p/sandbox/admiring-lamport-5wt3yg?file=%2Fsrc%2FDropdownMenu.tsx
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  HTMLProps,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  ReactNode,
  useEffect,
  forwardRef,
  useContext,
  useRef,
  useCallback,
  useMemo,
  type PropsWithChildren,
} from "react";

type SubMenuOpenEvent = { nodeId: string; parentId: string | null };

type MenuContext = {
  getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  setHasFocusInside: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

export const MenuContext = createContext<MenuContext>({
  getItemProps: () => ({}),
  activeIndex: null,
  setActiveIndex: () => {},
  setHasFocusInside: () => {},
  isOpen: false,
});

type MenuComponentProps = {
  /**
   * triggerにはpropsが渡されるので、それを受け取る必要がある
   */
  trigger: ReactNode;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  placement?: "bottom-start" | "right-start";
  width?: number;
} & HTMLProps<HTMLButtonElement>;

const MenuComponent = forwardRef<HTMLButtonElement, MenuComponentProps>(
  function MenuComponent(
    {
      children,
      trigger,
      onOpenChange,
      placement = "bottom-start",
      width = 280,
      ...props
    },
    forwardedRef,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenChange = useCallback(
      (open: boolean) => {
        onOpenChange?.(open);
        setIsOpen(open);
      },
      [onOpenChange],
    );

    const [hasFocusInside, setHasFocusInside] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const elementsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const parent = useContext(MenuContext);

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem();

    const isNested = parentId != null;

    const { floatingStyles, refs, context } = useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: handleOpenChange,
      placement: isNested ? "right-start" : placement,
      middleware: [offset({ mainAxis: 4 }), flip(), shift({ padding: 16 })],
      whileElementsMounted: autoUpdate,
    });

    const menuAnimation = useMemo((): Variants => {
      const fromLeft = isNested || placement === "right-start";

      return {
        initial: {
          opacity: 0,
          y: fromLeft ? 0 : -5,
          x: fromLeft ? -5 : 0,
        },
        animate: { opacity: 1, y: 0, x: 0 },
        exit: {
          opacity: 0,
          y: fromLeft ? 0 : -5,
          x: fromLeft ? -5 : 0,
        },
      };
    }, [isNested, placement]);

    const hover = useHover(context, {
      enabled: isNested,
      delay: { open: 75 },
      handleClose: safePolygon({ blockPointerEvents: true }),
    });
    const click = useClick(context, {
      event: "mousedown",
      toggle: !isNested,
      ignoreMouse: isNested,
    });
    const role = useRole(context, { role: "menu" });
    const dismiss = useDismiss(context, { bubbles: true, escapeKey: false });
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([hover, click, role, dismiss, listNavigation]);

    // Event emitter allows you to communicate across tree components.
    // This effect closes all menus when an item gets clicked anywhere
    // in the tree.
    useEffect(() => {
      if (!tree) return;

      function handleTreeClick() {
        handleOpenChange(false);
      }

      function onSubMenuOpen(event: SubMenuOpenEvent) {
        if (event.nodeId !== nodeId && event.parentId === parentId) {
          handleOpenChange(false);
        }
      }

      tree.events.on("click", handleTreeClick);
      tree.events.on("menuopen", onSubMenuOpen);

      return () => {
        tree.events.off("click", handleTreeClick);
        tree.events.off("menuopen", onSubMenuOpen);
      };
    }, [tree, nodeId, parentId, handleOpenChange]);

    useEffect(() => {
      if (isOpen && tree) {
        tree.events.emit("menuopen", {
          parentId,
          nodeId,
        } satisfies SubMenuOpenEvent);
      }
    }, [tree, isOpen, nodeId, parentId]);

    return (
      <FloatingNode id={nodeId}>
        <Slot
          ref={useMergeRefs([refs.setReference, item.ref, forwardedRef])}
          tabIndex={
            !isNested ? undefined : parent.activeIndex === item.index ? 0 : -1
          }
          role={isNested ? "menuitem" : undefined}
          data-open={isOpen ? "" : undefined}
          data-nested={isNested ? "" : undefined}
          data-focus-inside={hasFocusInside ? "" : undefined}
          className="data-open:bg-black/5"
          {...getReferenceProps(
            parent.getItemProps({
              ...props,
              onFocus(event: React.FocusEvent<HTMLButtonElement>) {
                props.onFocus?.(event);
                setHasFocusInside(false);
                parent.setHasFocusInside(true);
              },
            }),
          )}
        >
          {trigger}
        </Slot>
        <MenuContext.Provider
          value={{
            activeIndex,
            setActiveIndex,
            getItemProps,
            setHasFocusInside,
            isOpen,
          }}
        >
          <FloatingList elementsRef={elementsRef}>
            <AnimatePresence>
              {isOpen && (
                <FloatingPortal>
                  <FloatingOverlay lockScroll className="z-30">
                    <FloatingFocusManager
                      context={context}
                      modal={false}
                      initialFocus={isNested ? -1 : 0}
                      returnFocus={!isNested}
                    >
                      <div
                        className="z-40 focus-visible:outline-hidden"
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps({
                          onKeyDown: (e) => {
                            if (
                              e.key === "Escape" &&
                              e.target instanceof HTMLElement &&
                              (e.target.role === "menu" ||
                                e.target.role == "menuitem")
                            ) {
                              handleOpenChange(false);
                            }
                          },
                        })}
                      >
                        <motion.div
                          className="flex flex-col rounded-lg border border-stone-200 bg-stone-50 py-2 text-sm text-stone-700 shadow-md"
                          {...menuAnimation}
                          transition={{ duration: 0.1 }}
                          style={{ width }}
                        >
                          {children}
                        </motion.div>
                      </div>
                    </FloatingFocusManager>
                  </FloatingOverlay>
                </FloatingPortal>
              )}
            </AnimatePresence>
          </FloatingList>
        </MenuContext.Provider>
      </FloatingNode>
    );
  },
);

type MenuProps = MenuComponentProps & HTMLProps<HTMLButtonElement>;

export const Menu = forwardRef<HTMLButtonElement, MenuProps>(
  function Menu(props, ref) {
    const parentId = useFloatingParentNodeId();

    if (parentId === null) {
      return (
        <FloatingTree>
          <MenuComponent {...props} ref={ref} />
        </FloatingTree>
      );
    }

    return <MenuComponent {...props} ref={ref} />;
  },
);

export const MenuSeparator: React.FC = () => {
  return <div className="my-1 h-px w-full bg-stone-200" />;
};

type MenuActions = { label: string; right: ReactNode } & PropsWithChildren;
export const MenuActions: React.FC<MenuActions> = ({
  label,
  right,
  children,
}) => {
  return (
    <div className="flex flex-col justify-start gap-2 px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold">{label}</p>
        <p className="text-xs text-stone-500">{right}</p>
      </div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
};
