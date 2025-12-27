"use client";
import {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { IconButton } from "../icon-button";
import { PiSidebarSimpleLight } from "@react-icons/all-files/pi/PiSidebarSimpleLight";
import { useSidebarContext } from "../sidebar/provider";
import { Tooltip } from "../tooltip";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import clsx from "clsx";
import { appHeaderHeightName } from "../../lib";

type Props = {
  title: string;
  leftHeader?: ReactNode;
  rightHeader?: ReactNode;
} & PropsWithChildren;

export const AppLayout: React.FC<Props> = ({
  title,
  rightHeader,
  leftHeader,
  children,
}) => {
  const { isOpen: isSidebarOpen, setIsOpen: setIsSidebarOpen } =
    useSidebarContext();

  const [isTitleHiddenByHeader, setIsTitlteHiddenByHeader] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) {
      return;
    }

    const appHeaderHeight = getComputedStyle(titleRef.current).getPropertyValue(
      appHeaderHeightName,
    );
    if (appHeaderHeight === "") {
      throw new Error(`${appHeaderHeightName} が設定されていない`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          setIsTitlteHiddenByHeader(!e.isIntersecting);
        });
      },
      { rootMargin: `-${appHeaderHeight} 0px 0px 0px`, threshold: 0.9 },
    );
    observer.observe(titleRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="grid h-full grid-rows-[auto_1fr] justify-items-center overflow-auto">
      <div
        className={clsx(
          "sticky top-0 z-10 grid w-full grid-cols-[auto_1fr_auto] items-center justify-end justify-items-center bg-stone-50 px-4 transition-all",
          isTitleHiddenByHeader ? "border-b border-stone-200" : "",
        )}
        style={{ height: `var(${appHeaderHeightName})` }}
      >
        <div className="flex items-center gap-1">
          <LayoutGroup>
            <AnimatePresence mode="popLayout">
              {!isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Tooltip
                    label="サイドバーを開く"
                    keys={["M"]}
                    placement="bottom-start"
                  >
                    <IconButton
                      icon={PiSidebarSimpleLight}
                      onClick={() => {
                        setIsSidebarOpen(true);
                      }}
                    />
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div layout transition={{ duration: 0.1 }}>
              {leftHeader}
            </motion.div>
          </LayoutGroup>
        </div>
        <div>
          <AnimatePresence>
            {isTitleHiddenByHeader && (
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="text-base font-bold"
              >
                {title}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
        <div>{rightHeader}</div>
      </div>
      <div className="flex w-full justify-center px-[65px]">
        <div className="flex w-full max-w-[800px] flex-col gap-4">
          <h1 ref={titleRef} className="h-8 text-2xl font-bold">
            <AnimatePresence initial={false}>
              {!isTitleHiddenByHeader && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {title}
                </motion.div>
              )}
            </AnimatePresence>
          </h1>
          {children}
        </div>
      </div>
    </div>
  );
};
