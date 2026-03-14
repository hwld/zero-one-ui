import { PencilIcon, UserIcon } from "lucide-react";
import { Input } from "../input";
import { Textarea } from "../textarea";

export const ProfileForm: React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr_200px] gap-8">
      <div className="flex flex-col gap-4">
        <Input label="ユーザー名" />
        <Textarea label="プロフィール" rows={8} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm">アイコン</div>
        <button className="group relative grid size-[180px] place-items-center overflow-hidden rounded-full bg-neutral-800">
          <UserIcon size={150} className="transition-opacity group-hover:opacity-20" />
          <div className="absolute inset-0 grid place-content-center place-items-center gap-3 bg-black/30 text-neutral-100 opacity-0 transition-opacity group-hover:opacity-100">
            <PencilIcon size={50} />
            <div className="text-xs">アイコンを変更する</div>
          </div>
        </button>
      </div>
    </div>
  );
};
