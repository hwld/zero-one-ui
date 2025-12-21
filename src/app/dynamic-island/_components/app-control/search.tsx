import { motion } from "framer-motion";
import { APP_CONTROL_LAYOUT_ID } from "./app-control";
import { SearchIcon } from "lucide-react";

export const Search: React.FC = () => {
  return (
    <motion.div
      layoutId={APP_CONTROL_LAYOUT_ID}
      className="flex h-[40px] w-[450px] items-center gap-2 rounded-full bg-neutral-900 px-3 outline-2 outline-offset-2 outline-neutral-900 focus-within:outline-solid"
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      style={{ borderRadius: "20px" }}
    >
      <motion.div layout="preserve-aspect">
        <SearchIcon size={20} />
      </motion.div>
      <input className="grow bg-transparent text-neutral-100 outline-hidden" />
    </motion.div>
  );
};
