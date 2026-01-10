"use client";
import { TbMusic } from "@react-icons/all-files/tb/TbMusic";
import { TbX } from "@react-icons/all-files/tb/TbX";
import { TbPlayerPlayFilled } from "@react-icons/all-files/tb/TbPlayerPlayFilled";
import { TbPlayerPauseFilled } from "@react-icons/all-files/tb/TbPlayerPauseFilled";
import { MusicWavesIndicator } from "./music-waves-indicator";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { IconType } from "@react-icons/all-files/lib";

type Props = {
  id: string;
  fileName: string;
  onDelete?: (id: string) => void;
  isCurrentMusic: boolean;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onPause: () => void;
  volume: number;
  isMuted: boolean;
};

export const MusicFile: React.FC<Props> = ({
  id,
  fileName,
  onDelete,
  isCurrentMusic,
  isPlaying,
  onPlay,
  onPause,
  volume,
  isMuted,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onDelete?.(id);
  };

  useEffect(() => {
    if (isCurrentMusic) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isCurrentMusic]);

  const handlePlay = () => {
    onPlay(id);
  };

  return (
    <div ref={ref} className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {isCurrentMusic && isPlaying ? (
          <MusicFileButton hoverIcon={TbPlayerPauseFilled} onClick={onPause}>
            <MusicWavesIndicator volume={volume} isMuted={isMuted} />
          </MusicFileButton>
        ) : (
          <MusicFileButton hoverIcon={TbPlayerPlayFilled} onClick={handlePlay}>
            <TbMusic
              className={clsx(
                "text-[16px]",
                isCurrentMusic ? "text-sky-400" : "text-neutral-100",
              )}
            />
          </MusicFileButton>
        )}
        <div
          className={clsx(
            "text-sm break-all",
            isCurrentMusic ? "text-sky-400" : "text-neutral-100",
          )}
        >
          {fileName}
        </div>
      </div>
      {onDelete && (
        <button
          className="grid size-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/15 hover:text-neutral-300"
          onClick={handleDelete}
        >
          <TbX />
        </button>
      )}
    </div>
  );
};

const MusicFileButton: React.FC<
  {
    children: ReactNode;
    hoverIcon: IconType;
  } & ComponentPropsWithoutRef<"button">
> = ({ children, hoverIcon: HoverIcon, ...props }) => {
  return (
    <button
      {...props}
      className={
        "group relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-neutral-600 bg-neutral-800 text-neutral-100"
      }
    >
      {children}
      <div className="absolute inset-0 grid place-items-center bg-neutral-800 text-[18px] text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
        <HoverIcon />
      </div>
    </button>
  );
};
