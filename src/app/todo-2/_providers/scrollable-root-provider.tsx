import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";

type ScrollableRootContext = {
  scrollableRootRef: RefObject<HTMLDivElement | null>;
};

const ScrollableRootContext = createContext<ScrollableRootContext | undefined>(
  undefined,
);

export const ScrollableRootProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const scrollableRootRef = useRef<HTMLDivElement>(null);

  const value = useMemo((): ScrollableRootContext => {
    return {
      scrollableRootRef,
    };
  }, []);

  return (
    <ScrollableRootContext.Provider value={value}>
      {children}
    </ScrollableRootContext.Provider>
  );
};

export const useScrollableRoot = (): ScrollableRootContext => {
  const ctx = useContext(ScrollableRootContext);
  if (!ctx) {
    throw new Error(`${ScrollableRootProvider.name}が存在しません`);
  }
  return ctx;
};
