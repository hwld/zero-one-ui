import { XIcon } from "lucide-react";
import { useState } from "react";
import { Idle } from "./idle/idle";
import { Search } from "./search";
import { Sound } from "./sound";
import { Stopwatch } from "./stopwatch/stopwatch";
import { Settings } from "./settings/settings";

export type AppControlMode =
  | "idle"
  | "settings"
  | "sound"
  | "search"
  | "stopwatch";

export const APP_CONTROL_LAYOUT_ID = "controls";

export const AppControl: React.FC = () => {
  const [mode, setMode] = useState<AppControlMode>("idle");
  const content = {
    idle: <Idle onChangeMode={setMode} />,
    search: <Search />,
    settings: <Settings />,
    sound: <Sound />,
    stopwatch: <Stopwatch />,
  };

  return (
    <div className="flex max-w-dvw gap-2 px-2 text-neutral-100">
      {content[mode]}
      {mode !== "idle" && (
        <button
          onClick={() => setMode("idle")}
          className="grid size-[36px] shrink-0 place-items-center rounded-full bg-neutral-900 transition-colors hover:bg-neutral-700"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
};
