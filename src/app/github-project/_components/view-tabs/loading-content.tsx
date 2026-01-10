import { motion } from "motion/react";
import { LoadingAnimation } from "../loading-animation";

export const LoadingContent: React.FC = () => {
  return (
    <div className="absolute top-0 grid size-full place-content-center place-items-center">
      <motion.div exit={{ opacity: 0 }}>
        <LoadingAnimation />
      </motion.div>
    </div>
  );
};
