import { motion } from "motion/react";
import { APP_CONTROL_LAYOUT_ID, AppControlMode } from "../app-control";
import { MenuItem } from "./item";
import { SearchIcon, SettingsIcon, TimerIcon, Volume2Icon } from "lucide-react";

export const Idle: React.FC<{
  onChangeMode: (mode: AppControlMode) => void;
}> = ({ onChangeMode }) => {
  return (
    <motion.div
      layout
      layoutId={APP_CONTROL_LAYOUT_ID}
      className="flex h-[40px] w-fit min-w-[150px] items-center justify-between bg-neutral-900 px-[5px] shadow-sm"
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 400,
      }}
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex gap-1 [&>[data-control-item]:first-child]:rounded-l-full [&>[data-control-item]:last-child]:rounded-r-full"
      >
        <MenuItem icon={SearchIcon} onClick={() => onChangeMode("search")} />
        <MenuItem icon={TimerIcon} onClick={() => onChangeMode("stopwatch")} />
        <MenuItem icon={Volume2Icon} onClick={() => onChangeMode("sound")} />
        <MenuItem
          icon={SettingsIcon}
          onClick={() => onChangeMode("settings")}
        />
      </motion.div>
    </motion.div>
  );
};
