import { GhostIcon } from "lucide-react";
import { Routes } from "../../routes";
import { ButtonLink } from "../button";

export const ErrorContent: React.FC = () => {
  return (
    <div className="grid size-full min-h-fit place-content-center place-items-center gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <GhostIcon size={150} />
        <div className="text-center text-sm text-neutral-100">
          データ読み込みに
          <br />
          失敗しました
        </div>
      </div>
      <ButtonLink external color="primary" href={Routes.home({})}>
        ホームに戻る
      </ButtonLink>
    </div>
  );
};
