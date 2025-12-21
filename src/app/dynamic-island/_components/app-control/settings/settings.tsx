import { motion } from "framer-motion";
import { SettingItem } from "./item";
import { APP_CONTROL_LAYOUT_ID } from "../app-control";

export const Settings: React.FC = () => {
  return (
    <motion.div
      layoutId={APP_CONTROL_LAYOUT_ID}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="flex w-[250px] flex-col items-start gap-1 overflow-hidden bg-neutral-900 p-3"
      style={{ borderRadius: "20px" }}
    >
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
    </motion.div>
  );
};
