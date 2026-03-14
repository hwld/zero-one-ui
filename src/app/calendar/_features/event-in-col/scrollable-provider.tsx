import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type Context = {
  scrollableElement: HTMLDivElement | null;
  setScrollableElement: Dispatch<SetStateAction<HTMLDivElement | null>>;
};
const Context = createContext<Context | undefined>(undefined);

export const useScrollableElement = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${ScrollableProvider.name}が存在しません。`);
  }
  return ctx;
};

export const ScrollableProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [scrollableElement, setScrollableElement] = useState<HTMLDivElement | null>(null);

  return (
    <Context.Provider
      value={useMemo(() => ({ scrollableElement, setScrollableElement }), [scrollableElement])}
    >
      {children}
    </Context.Provider>
  );
};
