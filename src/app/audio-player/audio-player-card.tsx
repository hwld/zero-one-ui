import { TbDevices } from "@react-icons/all-files/tb/TbDevices";
import { TbList } from "@react-icons/all-files/tb/TbList";
import { TbPlayerPauseFilled } from "@react-icons/all-files/tb/TbPlayerPauseFilled";
import { TbPlayerPlayFilled } from "@react-icons/all-files/tb/TbPlayerPlayFilled";
import { TbPlayerSkipBackFilled } from "@react-icons/all-files/tb/TbPlayerSkipBackFilled";
import { TbPlayerSkipForwardFilled } from "@react-icons/all-files/tb/TbPlayerSkipForwardFilled";
import { TbPlayerTrackNextFilled } from "@react-icons/all-files/tb/TbPlayerTrackNextFilled";
import { TbPlayerTrackPrevFilled } from "@react-icons/all-files/tb/TbPlayerTrackPrevFilled";
import { TbQuestionMark } from "@react-icons/all-files/tb/TbQuestionMark";
import { TbRewindBackward10 } from "@react-icons/all-files/tb/TbRewindBackward10";
import { TbRewindForward10 } from "@react-icons/all-files/tb/TbRewindForward10";
import { TbVolume } from "@react-icons/all-files/tb/TbVolume";
import { TbVolumeOff } from "@react-icons/all-files/tb/TbVolumeOff";
import { Card } from "./card";
import { SubButton } from "./sub-button";
import { Slider } from "./slider";
import { useAudioContext } from "./audio/audio-provider";
import { Music } from "./page";
import Image from "next/image";

export type MusicChangeParam =
  | { type: "first" }
  | { type: "prev" }
  | { type: "next" }
  | { type: "last" }
  | { type: "unset" }
  | { type: "byId"; id: string };

type Props = {
  currentMusic: Music | undefined;
  hasPrev: boolean;
  hasNext: boolean;
  onMusicChange: (param: MusicChangeParam) => void;
};
export const AudioPlayerCard: React.FC<Props> = ({
  currentMusic,
  hasPrev,
  hasNext,
  onMusicChange,
}) => {
  const { audioRef, state, controls, handlers } = useAudioContext();

  const handleMusicChange = (param: MusicChangeParam) => {
    onMusicChange(param);
    controls.changePlaying(true);
  };

  return (
    <Card className="rounded-none border-0 lg:rounded-lg lg:border">
      <div className="flex h-full flex-col gap-8">
        <div className="relative min-h-[100px] w-full overflow-hidden rounded-lg text-neutral-900 lg:min-h-[230px]">
          <Image
            className="object-cover"
            src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${currentMusic?.fileName}`}
            alt="thumbnail"
            fill
          />
          <div className="absolute right-2 bottom-2 max-w-[60%] items-center truncate rounded-sm border border-neutral-300 bg-neutral-300 px-2 text-sm shadow-sm">
            {currentMusic?.fileName}
          </div>
        </div>
        <audio ref={audioRef} {...handlers}></audio>
        <div className="flex grow flex-col items-center justify-between gap-2">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-center gap-1">
              <SubButton
                disabled={!hasPrev || !state.isReady}
                onClick={() => handleMusicChange({ type: "first" })}
              >
                <TbPlayerTrackPrevFilled />
              </SubButton>
              <SubButton
                disabled={!hasPrev || !state.isReady}
                onClick={() => handleMusicChange({ type: "prev" })}
              >
                <TbPlayerSkipBackFilled />
              </SubButton>
              <SubButton
                disabled={!state.isReady}
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime - 10);
                }}
              >
                <TbRewindBackward10 />
              </SubButton>
              <button
                disabled={!state.isReady}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-sky-500 text-[25px] text-neutral-900 transition-colors hover:bg-sky-600 disabled:opacity-50"
                onClick={() => {
                  controls.changePlaying(!state.playing);
                }}
              >
                {state.playing ? (
                  <TbPlayerPauseFilled />
                ) : (
                  <TbPlayerPlayFilled />
                )}
              </button>
              <SubButton
                disabled={!state.isReady}
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime + 10);
                }}
              >
                <TbRewindForward10 />
              </SubButton>
              <SubButton
                disabled={!hasNext || !state.isReady}
                onClick={() => handleMusicChange({ type: "next" })}
              >
                <TbPlayerSkipForwardFilled />
              </SubButton>
              <SubButton
                disabled={!hasNext || !state.isReady}
                onClick={() => handleMusicChange({ type: "last" })}
              >
                <TbPlayerTrackNextFilled />
              </SubButton>
            </div>
            <div className="flex w-full items-center gap-2">
              <Time total={state.currentTime} />
              <Slider
                max={state.duration}
                min={0}
                step={state.duration / 1000}
                value={state.currentTime}
                onValueChange={(value) => {
                  controls.seek(value);
                  controls.changeCurrentTime(value);
                }}
                onValueCommit={() => {
                  controls.seekEnd();
                }}
              />
              <Time total={state.duration} />
            </div>
          </div>
          <div className="flex w-full justify-between gap-2">
            <div className="flex items-center">
              <SubButton
                onClick={() => {
                  controls.changeMute(!state.isMuted);
                }}
              >
                {state.volume === 0 || state.isMuted ? (
                  <TbVolumeOff />
                ) : (
                  <TbVolume />
                )}
              </SubButton>
              <div className="w-[120px]">
                <Slider
                  max={1}
                  min={0}
                  step={0.01}
                  value={state.isMuted ? 0 : state.volume}
                  onValueChange={(value) => {
                    controls.changeMute(false);
                    controls.changeVolume(value);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center">
              <SubButton>
                <TbDevices />
              </SubButton>
              <SubButton>
                <TbList />
              </SubButton>
              <SubButton>
                <TbQuestionMark />
              </SubButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Time: React.FC<{ total: number }> = ({ total }) => {
  const minuts = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return (
    <div className="text-sm text-neutral-400 tabular-nums">
      {minuts}:{seconds}
    </div>
  );
};
