import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type MinuteClockContext = Date;

const Context = createContext<MinuteClockContext | undefined>(undefined);

/**
 * 1分ごとに更新される日付を返す
 */
export const useMinuteClock = () => {
  const currentDate = useContext(Context);
  if (!currentDate) {
    throw new Error("MinuteClockproviderが存在しません");
  }

  return { currentDate };
};

export const MinuteClockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    let timer: number;
    const triggerMinuteUpdate = () => {
      timer = window.setTimeout(
        () => {
          setCurrentDate(new Date());
          triggerMinuteUpdate();
        },
        (60 - new Date().getSeconds()) * 1000,
      );
    };

    triggerMinuteUpdate();
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return <Context.Provider value={currentDate}>{children}</Context.Provider>;
};
