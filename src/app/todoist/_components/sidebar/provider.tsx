import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

type SidebarContext = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContext | undefined>(undefined);

export const SidebarContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("SIdebarContextProviderが存在しません");
  }

  return ctx;
};
