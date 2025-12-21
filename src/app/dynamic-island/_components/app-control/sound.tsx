import { motion } from "framer-motion";
import { useState } from "react";
import { Slider } from "../slider";
import { MicIcon, MicOffIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { APP_CONTROL_LAYOUT_ID } from "./app-control";

export const Sound: React.FC = () => {
  const [speaker, setSpeaker] = useState(50);
  const [mic, setMic] = useState(50);

  return (
    <motion.div
      layoutId={APP_CONTROL_LAYOUT_ID}
      className="w-[300px] overflow-hidden bg-neutral-900 px-5 pt-5 pb-8"
      style={{ borderRadius: "20px" }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="text-sm text-neutral-300">スピーカー</div>
            <Slider
              value={speaker}
              onChangeValue={setSpeaker}
              icon={speaker === 0 ? VolumeXIcon : Volume2Icon}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-300">マイク</div>
            <Slider
              value={mic}
              onChangeValue={setMic}
              icon={mic === 0 ? MicOffIcon : MicIcon}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
