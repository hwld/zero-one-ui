import { AnimatePresence, motion } from "motion/react";
import { Button } from "./button";
import { TbCheck } from "@react-icons/all-files/tb/TbCheck";
import { TbChevronDown } from "@react-icons/all-files/tb/TbChevronDown";
import {
  ComponentPropsWithoutRef,
  ForwardedRef,
  HTMLProps,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  flip,
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
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight } from "lucide-react";

const SelectContext = createContext<{
  activeIndex: number | null;
  getItemProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
}>({ activeIndex: null, getItemProps: () => ({}) });

type SelectComponentProps = {
  children: ReactNode;
  trigger: (params: { isOpen: boolean }) => ReactElement;
} & HTMLProps<HTMLButtonElement>;

const SelectComponent = forwardRef<HTMLButtonElement, SelectComponentProps>(
  function SelectComponent({ children, trigger, ...props }, forwardRef) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const elementsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const parent = useContext(SelectContext);

    const tree = useFloatingTree();
    const nodeId = useFloatingNodeId();
    const parentId = useFloatingParentNodeId();
    const item = useListItem();

    const isNested = parentId != null;

    const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
      nodeId,
      open: isOpen,
      onOpenChange: setIsOpen,
      placement: isNested ? "right-start" : "bottom-start",
      middleware: [
        offset({
          mainAxis: isNested ? 0 : 4,
          alignmentAxis: isNested ? -4 : 0,
        }),
        flip(),
        shift(),
      ],
    });
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
    const dismiss = useDismiss(context, { bubbles: true });
    const listNavigation = useListNavigation(context, {
      listRef: elementsRef,
      activeIndex,
      nested: isNested,
      onNavigate: setActiveIndex,
      loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([hover, click, dismiss, listNavigation]);

    useEffect(() => {
      if (!tree) return;

      const handleTreeItemClick = () => {
        setIsOpen(false);
      };

      tree.events.on("click", handleTreeItemClick);
      return () => {
        tree.events.off("click", handleTreeItemClick);
      };
    }, [tree]);

    return (
      <FloatingNode id={nodeId}>
        <Slot
          ref={useMergeRefs([refs.setReference, item.ref, forwardRef])}
          tabIndex={
            !isNested ? undefined : parent.activeIndex === item.index ? 0 : -1
          }
          {...getReferenceProps(
            parent.getItemProps({
              ...props,
            }),
          )}
        >
          {trigger({ isOpen: isOpen })}
        </Slot>
        <SelectContext.Provider value={{ activeIndex, getItemProps }}>
          <FloatingList elementsRef={elementsRef}>
            <AnimatePresence>
              {isOpen && (
                <FloatingPortal>
                  <FloatingFocusManager
                    context={context}
                    modal={false}
                    initialFocus={isNested ? -1 : 0}
                    returnFocus={!isNested}
                  >
                    <div
                      className="z-30 focus:outline-hidden"
                      ref={refs.setFloating}
                      style={floatingStyles}
                      {...getFloatingProps()}
                    >
                      <motion.div
                        className="flex min-w-[150px] flex-col rounded-sm border border-neutral-300 bg-zinc-50 p-[2px] text-sm text-neutral-700 shadow-sm focus:outline-hidden"
                        initial={
                          isNested
                            ? { opacity: 0, x: -4 }
                            : { opacity: 0, y: -4 }
                        }
                        animate={
                          isNested ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }
                        }
                        exit={
                          isNested
                            ? { opacity: 0, x: -4 }
                            : { opacity: 0, y: -4 }
                        }
                        transition={{ duration: 0.1 }}
                      >
                        {children}
                      </motion.div>
                    </div>
                  </FloatingFocusManager>
                </FloatingPortal>
              )}
            </AnimatePresence>
          </FloatingList>
        </SelectContext.Provider>
      </FloatingNode>
    );
  },
);

type SelectItemBaseProps = {
  selected?: boolean;
  label: string;
  option?: ReactNode;
} & ComponentPropsWithoutRef<"button">;

const SelectItemBase = forwardRef(function SelectItemBase(
  { label, option, selected = false, ...props }: SelectItemBaseProps,
  forwardRef: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={forwardRef}
      {...props}
      className="grid h-[28px] grid-cols-[15px_1fr_20px] place-content-center gap-1 rounded-sm px-2 transition-colors focus:bg-neutral-200 focus-visible:outline-hidden"
    >
      <div className="grid size-full place-items-center">
        {selected ? <TbCheck /> : null}
      </div>
      <div className="w-full text-start">{label}</div>
      <div className="grid size-full place-content-end place-items-center">
        {option}
      </div>
    </button>
  );
});

type SelectItemProps<T> = {
  valueItem: SelectValueItem<T>;
  selected?: boolean;
} & ComponentPropsWithoutRef<"button">;

export const SelectItem = forwardRef(function SelectItem<T>(
  { selected, valueItem, ...props }: SelectItemProps<T>,
  forwardRef: ForwardedRef<HTMLButtonElement>,
) {
  const selectMenu = useContext(SelectContext);
  const item = useListItem();
  const tree = useFloatingTree();
  const isActive = item.index === selectMenu.activeIndex;

  return (
    <SelectItemBase
      {...props}
      ref={useMergeRefs([item.ref, forwardRef])}
      tabIndex={isActive ? 0 : -1}
      {...selectMenu.getItemProps({
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          props.onClick?.(e);
          tree?.events.emit("click");
        },
      })}
      label={valueItem.label}
      selected={selected}
      option={
        <div className="text-xs text-neutral-500">{valueItem.shortcut}</div>
      }
    />
  );
});

type SelectValueItem<T> = {
  type: "root";
  value: T;
  label: string;
  shortcut?: string;
};
type SelectNestItem<T> = {
  type: "nest";
  label: string;
  items: SelectValueItem<T>[];
};
export type SelectItem<T> = SelectValueItem<T> | SelectNestItem<T>;

type SelectProps<T> = {
  selectedValue: T;
  items: SelectItem<T>[];
  onSelect: (value: T) => void;
  isEqual: (a: T, b: T) => boolean;
};

export const Select = <T,>({
  items,
  selectedValue,
  onSelect,
  isEqual,
}: SelectProps<T>) => {
  const selectedItem = items
    .flatMap((item) => {
      if (item.type === "root") {
        return item;
      } else if (item.type === "nest") {
        return item.items;
      }
      throw new Error(item satisfies never);
    })
    .find((item) => {
      return isEqual(item.value, selectedValue);
    });

  if (!selectedItem) {
    throw new Error("存在しない値が選択されています");
  }

  return (
    <FloatingTree>
      <SelectComponent
        trigger={({ isOpen }) => {
          return (
            <Button active={isOpen}>
              <div className="flex items-center justify-between gap-1">
                {selectedItem.label}
                <TbChevronDown />
              </div>
            </Button>
          );
        }}
      >
        {items.map((item, i) => {
          if (item.type === "root") {
            return (
              <SelectItem
                key={i}
                valueItem={item}
                selected={isEqual(selectedValue, item.value)}
                onClick={() => {
                  onSelect(item.value);
                }}
              />
            );
          } else if (item.type === "nest") {
            return (
              <SubSelect
                key={i}
                selectedValue={selectedValue}
                items={item.items}
                label={item.label}
                onSelect={onSelect}
                isEqual={isEqual}
              />
            );
          }
        })}
      </SelectComponent>
    </FloatingTree>
  );
};

const SubSelect = <T,>({
  label,
  items,
  selectedValue,
  onSelect,
  isEqual,
}: SelectProps<T> & { label: string }) => {
  return (
    <SelectComponent
      trigger={() => {
        return (
          <SelectItemBase
            label={label}
            option={<ChevronRight className="-mr-1" size={16} />}
          />
        );
      }}
    >
      {items.map((item, i) => {
        if (item.type === "root") {
          return (
            <SelectItem
              key={i}
              valueItem={item}
              selected={isEqual(selectedValue, item.value)}
              onClick={() => {
                onSelect(item.value);
              }}
            />
          );
        } else if (item.type === "nest") {
          return (
            <SubSelect
              key={i}
              items={item.items}
              selectedValue={selectedValue}
              onSelect={onSelect}
              label={item.label}
              isEqual={isEqual}
            />
          );
        }
      })}
    </SelectComponent>
  );
};
