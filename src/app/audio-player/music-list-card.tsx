import { TbMusicPlus } from "@react-icons/all-files/tb/TbMusicPlus";
import { Card } from "./card";
import { MusicFile } from "./music-file";
import { Music } from "./page";
import { useAudioContext } from "./audio/audio-provider";
import { MusicChangeParam } from "./audio-player-card";
import { ChangeEvent, DragEvent, useRef } from "react";

type Props = {
  musics: Music[];
  prevMusicId: string | undefined;
  nextMusicId: string | undefined;
  currentMusicId: string | undefined;
  onAddMusics: (musics: Music[]) => void;
  onDeleteMusic: (id: string) => void;
  onMusicChange: (params: MusicChangeParam) => void;
};
export const MusicListCard: React.FC<Props> = ({
  musics,
  prevMusicId,
  nextMusicId,
  currentMusicId,
  onAddMusics,
  onDeleteMusic,
  onMusicChange,
}) => {
  const { state, controls } = useAudioContext();

  const handleDeleteMusic = (id: string) => {
    if (id === currentMusicId) {
      if (prevMusicId) {
        onMusicChange({ type: "prev" });
      } else if (nextMusicId) {
        onMusicChange({ type: "next" });
      } else {
        onMusicChange({ type: "unset" });
      }
      controls.changePlaying(false);
    }
    onDeleteMusic(id);
  };

  const handlePlay = (id: string) => {
    onMusicChange({ type: "byId", id });
    controls.changePlaying(true);
  };

  const addMusicFiles = (files: FileList) => {
    const musics = Array.from(files)
      .filter((f) => f.type.startsWith("audio/"))
      .map((f): Music => {
        return {
          fileName: f.name,
          url: URL.createObjectURL(f),
          id: crypto.randomUUID(),
        };
      });
    onAddMusics(musics);
  };

  const handleMusicFilesDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addMusicFiles(e.dataTransfer.files);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleMusicFilesClick = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const handleMusicFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addMusicFiles(e.target.files);
    }
    e.target.value = "";
  };

  return (
    <div className="flex h-full max-h-full flex-col p-4 lg:h-min lg:p-0">
      <Card>
        <div className="flex min-h-0 grow flex-col gap-4">
          <div
            className="grid h-[100px] w-full shrink-0 place-items-center rounded-lg border-2 border-dashed border-neutral-500 bg-white/5 lg:h-[230px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleMusicFilesDrop}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="hidden flex-col items-center gap-2 lg:flex">
                <TbMusicPlus className="size-[40px]" />
                <div className="text-center text-sm">
                  ここに音声をドラッグ&ドロップしてください
                </div>
                <div className="text-center text-xs text-neutral-400">
                  音声はサーバーにアップロードされることはありません。
                  <br />
                  画面を更新するとリセットされます。
                </div>
              </div>
              <button
                className="h-7 rounded-full bg-neutral-100 px-3 text-xs text-neutral-700 transition-colors hover:bg-neutral-300"
                onClick={handleMusicFilesClick}
              >
                ファイルを選択する
              </button>
              <input
                ref={fileInputRef}
                multiple
                accept="audio/*"
                className="hidden"
                type="file"
                onChange={handleMusicFileSelect}
              />
            </div>
          </div>

          {musics.length > 0 && (
            <div className="flex grow flex-col gap-2 overflow-hidden">
              <div className="flex items-center gap-2 px-2 text-neutral-400">
                music files
                <div className="grid size-6 shrink-0 place-items-center rounded-full bg-neutral-600 text-xs font-bold text-neutral-100">
                  {musics.length}
                </div>
              </div>
              <div className="flex grow flex-col gap-2 overflow-auto rounded-lg px-2">
                {musics.map((m) => {
                  const isCurrent = currentMusicId === m.id;
                  return (
                    <MusicFile
                      key={m.id}
                      id={m.id}
                      fileName={m.fileName}
                      isCurrentMusic={isCurrent}
                      isPlaying={isCurrent && state.playing}
                      volume={state.volume}
                      isMuted={state.isMuted}
                      onDelete={m.sample ? undefined : handleDeleteMusic}
                      onPlay={handlePlay}
                      onPause={() => {
                        if (isCurrent) {
                          controls.changePlaying(false);
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
