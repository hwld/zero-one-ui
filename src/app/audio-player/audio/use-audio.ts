import {
  ComponentPropsWithoutRef,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type UseAudioParams = {
  src: string;
  initialVolume?: number;
};

export const useAudio = ({ src, initialVolume: _initialVolume = 1 }: UseAudioParams) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [initialVolume] = useState(_initialVolume);
  const [volume, setVolume] = useState(initialVolume);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const withReadyCheck = useCallback(
    (callback: () => void) => {
      if (isReady) {
        callback();
      }
    },
    [isReady],
  );

  const changePlaying = useCallback(
    (playing: boolean) => {
      withReadyCheck(() => {
        if (!audioRef.current) {
          return;
        }

        window.setTimeout(async () => {
          if (!audioRef.current) {
            throw new Error("audioが存在しない");
          }

          if (playing) {
            await audioRef.current.play();
          } else {
            audioRef.current.pause();
          }
        }, 0);

        setPlaying(playing);
      });
    },
    [withReadyCheck],
  );

  const changeCurrentTime = useCallback(
    (currentTime: number) => {
      withReadyCheck(() => {
        if (!audioRef.current) {
          return;
        }

        let valid = currentTime;
        if (currentTime < 0) {
          valid = 0;
        }
        if (currentTime > duration) {
          valid = duration;
        }

        audioRef.current.currentTime = valid;
        setCurrentTime(valid);
      });
    },
    [duration, withReadyCheck],
  );

  const seekStartPlaying = useRef<boolean | undefined>(undefined);
  const seek = useCallback(
    (currentTime: number) => {
      withReadyCheck(() => {
        if (!audioRef.current) {
          return;
        }

        if (seekStartPlaying.current === undefined) {
          seekStartPlaying.current = !audioRef.current.paused;
        }
        setIsSeeking(true);

        audioRef.current.pause();
        changeCurrentTime(currentTime);
      });
    },
    [changeCurrentTime, withReadyCheck],
  );

  const seekEnd = useCallback(() => {
    withReadyCheck(() => {
      if (!audioRef.current) {
        return;
      }

      setIsSeeking(false);

      window.setTimeout(() => {
        if (audioRef.current && seekStartPlaying.current) {
          void audioRef.current.play();
        }
        seekStartPlaying.current = undefined;
      }, 0);
    });
  }, [withReadyCheck]);

  const changeDuration = useCallback((duration: number) => {
    if (!audioRef.current) {
      return;
    }
    setDuration(duration);
  }, []);

  const changeVolume = useCallback((volume: number) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
    setVolume(volume);
  }, []);

  const changeMute = useCallback((muted: boolean) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.muted = muted;
    setIsMuted(muted);
  }, []);

  const onPlay = useCallback(() => {
    setPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    if (!isSeeking) {
      changePlaying(false);
    }
  }, [changePlaying, isSeeking]);

  const prevTime = useRef(0);
  const onTimeUpdate = useCallback((e: SyntheticEvent<HTMLAudioElement>) => {
    const currentTime = e.currentTarget.currentTime;
    if (Math.floor(prevTime.current) === Math.floor(currentTime)) {
      return;
    }

    setCurrentTime(currentTime);
    prevTime.current = currentTime;
  }, []);

  const onDurationChange = useCallback(
    (e: SyntheticEvent<HTMLAudioElement>) => {
      changeDuration(e.currentTarget.duration);
    },
    [changeDuration],
  );

  const onEnded = useCallback(() => {
    setPlaying(false);
  }, []);

  const onCanPlay = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.volume = initialVolume;
  }, [initialVolume]);

  // audio要素にsrcを直接渡すとdurationなどの初期化がうまくいかないため、
  // refを使ってsrcを設定する
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    audioRef.current.src = src;
  }, [src]);

  const state = useMemo(() => {
    return {
      playing,
      currentTime,
      duration,
      volume,
      isSeeking,
      isReady,
      isMuted,
    };
  }, [currentTime, duration, isMuted, isReady, isSeeking, playing, volume]);

  const controls = useMemo(() => {
    return {
      changeCurrentTime,
      changeDuration,
      seek,
      seekEnd,
      changePlaying,
      changeVolume,
      changeMute,
    };
  }, [changeCurrentTime, changeDuration, changeMute, changePlaying, changeVolume, seek, seekEnd]);

  const handlers = useMemo((): ComponentPropsWithoutRef<"audio"> => {
    return {
      onPlay,
      onPause,
      onTimeUpdate,
      onDurationChange,
      onEnded,
      onCanPlay,
    };
  }, [onCanPlay, onDurationChange, onEnded, onPause, onPlay, onTimeUpdate]);

  return { audioRef, state, controls, handlers };
};
