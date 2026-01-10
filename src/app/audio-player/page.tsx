"use client";
import { useMemo, useState } from "react";
import { AudioPlayerCard, MusicChangeParam } from "./audio-player-card";
import { Music } from "lucide-react";
import { AudioProvider } from "./audio/audio-provider";
import { MusicListCard } from "./music-list-card";
import clsx from "clsx";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

export type Music = {
  fileName: string;
  url: string;
  id: string;
  sample?: boolean;
};

const Page: React.FC = () => {
  const [musics, setMusics] = useState<Music[]>([
    {
      id: crypto.randomUUID(),
      fileName: "sample-music-1",
      url: "/audio-player/sample1.mp3",
      sample: true,
    },
    {
      id: crypto.randomUUID(),
      fileName: "sample-music-2",
      url: "/audio-player/sample2.mp3",
      sample: true,
    },
  ]);

  const [currentMusicId, setCurrentMusicId] = useState<string | undefined>(
    musics[0].id,
  );
  const currentMusic = useMemo(() => {
    const music = musics.find((m) => m.id === currentMusicId);
    if (!music) {
      return undefined;
    }

    return music;
  }, [currentMusicId, musics]);

  const prevMusic = useMemo((): Music | undefined => {
    const index = musics.findIndex((m) => m.id === currentMusicId);
    return musics[index - 1];
  }, [currentMusicId, musics]);

  const nextMusic = useMemo((): Music | undefined => {
    const index = musics.findIndex((m) => m.id === currentMusicId);
    return musics[index + 1];
  }, [currentMusicId, musics]);

  const handleMusicChange = (param: MusicChangeParam) => {
    switch (param.type) {
      case "first": {
        if (!musics[0]) {
          throw new Error("エピソードが存在しない");
        }
        setCurrentMusicId(musics[0].id);
        break;
      }
      case "prev": {
        if (!prevMusic) {
          throw new Error("前のエピソードが存在しない");
        }
        setCurrentMusicId(prevMusic.id);
        break;
      }
      case "next": {
        if (!nextMusic) {
          throw new Error("次のエピソードが存在しない");
        }
        setCurrentMusicId(nextMusic.id);
        break;
      }
      case "last": {
        const last = musics.at(-1);
        if (!last) {
          throw new Error("エピソードが存在しない");
        }
        setCurrentMusicId(last.id);
        break;
      }
      case "unset": {
        setCurrentMusicId(undefined);
        break;
      }
      case "byId": {
        const id = musics.find((m) => m.id === param.id)?.id;
        if (!id) {
          throw new Error("エピソードが存在しない");
        }

        setCurrentMusicId(id);
        break;
      }
      default: {
        throw new Error(param satisfies never);
      }
    }
  };

  const handleAddMusics = (musics: Music[]) => {
    setMusics((ms) => [...ms, ...musics]);
  };

  const handleDeleteMusic = (id: string) => {
    setMusics((ms) => {
      const target = ms.find((m) => m.id === id);
      if (!target) {
        return ms;
      }

      URL.revokeObjectURL(target.url);
      return ms.filter((m) => m.id !== id);
    });
  };

  const bgClass = "bg-neutral-900";
  useBodyBgColor(bgClass);

  return (
    <AudioProvider src={currentMusic?.url}>
      <div
        className={clsx(
          "grid h-dvh w-full place-items-center text-neutral-100",
          bgClass,
        )}
        style={{ colorScheme: "dark" }}
      >
        <div className="grid size-full min-h-0 grid-cols-[1fr] grid-rows-[1fr_300px] place-content-center gap-4 lg:grid-cols-[400px_400px] lg:grid-rows-[500px]">
          <div className="order-2 size-full min-h-0 lg:order-1">
            <AudioPlayerCard
              currentMusic={currentMusic}
              hasPrev={!!prevMusic}
              hasNext={!!nextMusic}
              onMusicChange={handleMusicChange}
            />
          </div>
          <div className="order-1 size-full min-h-0 lg:order-2">
            <MusicListCard
              musics={musics}
              prevMusicId={prevMusic?.id}
              nextMusicId={prevMusic?.id}
              currentMusicId={currentMusicId}
              onAddMusics={handleAddMusics}
              onDeleteMusic={handleDeleteMusic}
              onMusicChange={handleMusicChange}
            />
          </div>
        </div>
      </div>
    </AudioProvider>
  );
};

export default Page;
