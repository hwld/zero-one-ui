import { motion } from "motion/react";
import { TbVolumeOff } from "@react-icons/all-files/tb/TbVolumeOff";

const delays = [0.1, 0.3, 0.2, 0.4];

type Props = { volume: number; isMuted: boolean };

export const MusicWavesIndicator: React.FC<Props> = ({ volume, isMuted }) => {
  const y1 = `${100}%`;
  const y2 = `${90 * (1 - volume)}%`;

  if (isMuted || volume === 0) {
    return <TbVolumeOff className="text-sky-400" />;
  }

  return (
    <div className="grid size-[15px] grid-cols-4 items-end justify-between gap-px overflow-hidden bg-transparent">
      {[...new Array(4)].map((_, i) => {
        return (
          <motion.div
            key={i}
            initial={{ y: y1 }}
            animate={{
              y: [y1, y2, y1],
              transition: { repeat: Infinity, delay: delays[i] },
            }}
            className="h-full bg-sky-400 py-[2px]"
          />
        );
      })}
    </div>
  );
};
