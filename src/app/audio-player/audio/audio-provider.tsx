import { ReactNode, createContext, useContext } from "react";
import { useAudio } from "./use-audio";

type AudioContext = ReturnType<typeof useAudio>;
const AudioContext = createContext<AudioContext | undefined>(undefined);
export const useAudioContext = (): AudioContext => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("AudioProviderが存在しません");
  }
  return ctx;
};

export const AudioProvider: React.FC<{
  children: ReactNode;
  src: string | undefined;
}> = ({ children, src }) => {
  const context = useAudio({ src: src ?? "", initialVolume: 0.1 });
  return <AudioContext.Provider value={context}>{children}</AudioContext.Provider>;
};
