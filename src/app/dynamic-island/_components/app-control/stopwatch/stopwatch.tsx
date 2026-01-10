import { useMemo, useRef, useState } from "react";
import { StopwatchButton } from "./button";
import {
  Minimize2,
  PauseIcon,
  PlayIcon,
  TimerIcon,
  TimerResetIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { APP_CONTROL_LAYOUT_ID } from "../app-control";

const maxSeconds = 359_999;

export const Stopwatch: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isMin, setIsMin] = useState(false);
  const [state, setState] = useState<"running" | "stopped">("stopped");
  const timerIdRef = useRef<number | undefined>(undefined);

  const handleStartTimer = () => {
    window.clearInterval(timerIdRef.current);
    timerIdRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s >= maxSeconds) {
          window.clearInterval(timerIdRef.current);
          setState("stopped");
          return s;
        }
        return s + 1;
      });
    }, 1000);

    setState("running");
  };

  const handleStopTimer = () => {
    window.clearInterval(timerIdRef.current);
    setState("stopped");
  };

  const handleClearTimer = () => {
    setSeconds(0);
  };

  const timerDisplay = useMemo(() => {
    const hh = `0${Math.floor(seconds / 3600)}`.slice(-2);
    const mm = `0${Math.floor(seconds / 60) % 60}`.slice(-2);
    const ss = `0${Math.floor(seconds % 60)}`.slice(-2);

    return `${hh}:${mm}:${ss}`;
  }, [seconds]);

  const actionButtons = {
    stopped: (
      <StopwatchButton
        onClick={handleStartTimer}
        disabled={seconds >= maxSeconds}
      >
        <PlayIcon className="pl-[2px]" />
      </StopwatchButton>
    ),
    running: (
      <StopwatchButton onClick={handleStopTimer}>
        <PauseIcon />
      </StopwatchButton>
    ),
  };

  return isMin ? (
    <motion.button
      layoutId={APP_CONTROL_LAYOUT_ID}
      onClick={() => setIsMin(false)}
      className="w-[200px] overflow-hidden bg-neutral-900 px-3 py-2 text-neutral-100"
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex items-center justify-between"
      >
        <motion.span layoutId="action">
          <TimerIcon size={20} />
        </motion.span>
        <motion.div
          layoutId="display"
          className="text-sm text-neutral-300 tabular-nums"
        >
          {timerDisplay}
        </motion.div>
      </motion.div>
    </motion.button>
  ) : (
    <motion.div
      layoutId={APP_CONTROL_LAYOUT_ID}
      className="relative w-[250px] overflow-hidden bg-neutral-900 p-4 text-neutral-100"
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex items-center justify-between"
      >
        <div className="flex gap-2">
          <motion.span layoutId="action">{actionButtons[state]}</motion.span>
          <AnimatePresence>
            {seconds > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StopwatchButton onClick={handleClearTimer} secondary>
                  <TimerResetIcon className="pr-[2px] pb-px" />
                </StopwatchButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            className="rounded-sm p-1 transition-colors hover:bg-white/20"
            onClick={() => setIsMin(true)}
          >
            <Minimize2 size={15} />
          </button>
          <motion.div
            layoutId="display"
            className="text-xl font-bold tabular-nums select-none"
          >
            {timerDisplay}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
