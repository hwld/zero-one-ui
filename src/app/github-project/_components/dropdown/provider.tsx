import {
  FloatingList,
  Placement,
  UseFloatingReturn,
  autoUpdate,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react";
import { ReactNode, createContext, useContext, useMemo, useRef, useState } from "react";

/**
 * https://github.com/radix-ui/primitives/issues/2545
 * radix-uiのdropdown-menuは、マウスを使用してMenuを閉じたときにもtriggerにfocus-visibleを付与してしまう。
 * onCloseAutoFocusを使用すると閉じたときにフォーカスを与えないようにもできるのだが、キーボードで操作しているときには
 * フォーカスを当てたい。
 *
 * floating-uiを使用するとそのような問題は起こらなさそうだったので、これを使って自作する
 */

type DropdownContext = {
  isOpen: boolean;
  activeIndex: number | null;
  setActiveIndex: (value: number | null) => void;
} & UseFloatingReturn &
  ReturnType<typeof useInteractions>;
const DropdownContext = createContext<DropdownContext | undefined>(undefined);

export const useDropdown = (): DropdownContext => {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error("DropdownProviderが存在しません。");
  }
  return ctx;
};

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: Placement;
};

export const DropdownProvider: React.FC<Props> = ({
  children,
  isOpen,
  onOpenChange,
  placement = "bottom-start",
}) => {
  const floating = useFloating({
    open: isOpen,
    onOpenChange,
    placement,
    middleware: [offset(4), flip()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(floating.context);
  const dismiss = useDismiss(floating.context, {
    escapeKey: false,
  });

  const listRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listNavigation = useListNavigation(floating.context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const interactions = useInteractions([click, dismiss, listNavigation]);

  const value = useMemo((): DropdownContext => {
    return {
      isOpen,
      activeIndex,
      setActiveIndex,
      ...floating,
      ...interactions,
    };
  }, [activeIndex, floating, interactions, isOpen]);

  return (
    <DropdownContext.Provider value={value}>
      <FloatingList elementsRef={listRef}>{children}</FloatingList>
    </DropdownContext.Provider>
  );
};
