"use client";
import React, { Suspense, useMemo } from "react";
import { motion } from "framer-motion";
import { Resizable } from "re-resizable";
import { useRef } from "react";
import { PiBellSimpleLight } from "@react-icons/all-files/pi/PiBellSimpleLight";
import { PiSidebarSimpleLight } from "@react-icons/all-files/pi/PiSidebarSimpleLight";
import { ProjectNavList } from "../../_features/project/project-nav-list/list";
import { Routes } from "../../routes";
import { usePathname, useSearchParams } from "next/navigation";
import { Tooltip, TooltipDelayGroup } from "../tooltip";
import { UserMenuTrigger } from "./user-menu";
import { SidebarNavList } from "./nav-list";
import { IconButton } from "../icon-button";
import { useSidebarContext } from "./provider";
import { appHeaderHeightName } from "../../lib";

export const Sidebar: React.FC = () => {
  const resizableRef = useRef<Resizable>(null);

  const { isOpen, setIsOpen } = useSidebarContext();
  const marginLeft = useMemo(() => {
    if (isOpen) {
      return 0;
    }

    const barWidth = resizableRef.current?.size.width;
    return barWidth ? -barWidth : 0;
  }, [isOpen]);

  const handleClass = "flex justify-center group z-20";
  const handle = (
    <div className="h-full w-1 transition-colors group-hover:bg-black/10 group-active:bg-black/20" />
  );

  return (
    <TooltipDelayGroup>
      <motion.div className="flex" animate={{ marginLeft }}>
        <Resizable
          ref={resizableRef}
          className="bg-stone-200/40"
          handleClasses={{ right: handleClass }}
          handleComponent={{ right: handle }}
          enable={{ right: true }}
          minWidth={210}
          defaultSize={{ width: 250 }}
          maxWidth={420}
        >
          <Suspense>
            <SidebarContent isOpen={isOpen} onChangeOpen={setIsOpen} />
          </Suspense>
        </Resizable>
      </motion.div>
    </TooltipDelayGroup>
  );
};

type ContentProps = { isOpen: boolean; onChangeOpen: (open: boolean) => void };

const SidebarContent: React.FC<ContentProps> = ({ isOpen, onChangeOpen }) => {
  const paths = usePathname();
  const searchParams = useSearchParams();

  const currentRoute = useMemo(() => {
    if (paths === Routes.project()) {
      const id = searchParams.get("id");
      if (id) {
        return Routes.project(id);
      }
    }

    return paths;
  }, [paths, searchParams]);

  return (
    <div className="group/sidebar relative flex size-full flex-col gap-2">
      <div
        className="flex w-full items-center justify-between px-3"
        style={{ height: `var(${appHeaderHeightName})` }}
      >
        <UserMenuTrigger />
        <div className="flex items-center gap-1">
          <Tooltip label="通知を開く" keys={["O", "N"]}>
            <IconButton icon={PiBellSimpleLight} />
          </Tooltip>
          <Tooltip label="サイドバーを閉じる" keys={["M"]}>
            <IconButton
              icon={PiSidebarSimpleLight}
              onClick={() => {
                onChangeOpen(false);
              }}
              style={{ opacity: isOpen ? 1 : 0 }}
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-3">
        <SidebarNavList currentRoute={currentRoute} />
        <ProjectNavList currentRoute={currentRoute} />
      </div>
    </div>
  );
};
