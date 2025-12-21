import { useMemo } from "react";
import { PiCommand } from "@react-icons/all-files/pi/PiCommand";
import { PiArrowFatUp } from "@react-icons/all-files/pi/PiArrowFatUp";

type Props = { children: KeyboardKey };

export const Kbd: React.FC<Props> = ({ children }) => {
  const key = useMemo(() => {
    if (children === "Cmd") {
      return <PiCommand />;
    }

    if (children === "Shift") {
      return <PiArrowFatUp />;
    }

    return children;
  }, [children]);

  return (
    <kbd className="grid size-5 place-items-center rounded-sm bg-stone-500 text-stone-100">
      {key}
    </kbd>
  );
};

export type KeyboardKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  // | "ArrowUp"
  // | "ArrowDown"
  // | "ArrowLeft"
  // | "ArrowRight"
  // | "Enter"
  // | "Escape"
  // | "Backspace"
  // | "Tab"
  // | "Space"
  | "Shift"
  // | "Ctrl"
  // | "Alt"
  // | "Meta"
  | "Cmd"
  | ".";
