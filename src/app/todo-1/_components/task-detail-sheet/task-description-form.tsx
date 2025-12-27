import { AnimatePresence, motion } from "motion/react";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

export const TaskDescriptionForm: React.FC<{
  id: string;
  defaultDescription: string;
  onChangeDescription: (desc: string) => void;
}> = ({ id, defaultDescription, onChangeDescription }) => {
  const [desc, setDesc] = useState(defaultDescription);
  const isDirty = desc !== defaultDescription;

  return (
    <div className="space-y-1">
      <textarea
        id={id}
        className="h-[300px] w-full resize-none rounded-sm border border-neutral-300 bg-transparent p-3 focus-visible:border-neutral-400 focus-visible:outline-neutral-900"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <AnimatePresence>
        {isDirty && (
          <motion.div
            className="flex justify-between"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className="flex items-center gap-1">
              <AlertCircleIcon size={18} className="shrink-0" />
              <div className="text-xs">変更が保存されていません</div>
            </div>
            <div className="flex gap-1">
              <button
                className="rounded-sm border border-neutral-300 px-3 py-1 text-sm whitespace-nowrap text-neutral-700 transition-colors hover:bg-black/10"
                onClick={() => setDesc(defaultDescription)}
              >
                変更を取り消す
              </button>
              <button
                className="rounded-sm bg-neutral-900 px-3 py-1 text-sm whitespace-nowrap text-neutral-100 transition-colors hover:bg-neutral-700"
                onClick={() => onChangeDescription(desc)}
              >
                保存
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
