import { BirdIcon, CatIcon, DogIcon, FishIcon, PlusIcon, RabbitIcon } from "lucide-react";
import { Spacer } from "../spacer";
import { ServerItem } from "./item";

export const ServerSidebar: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-3 bg-neutral-950 py-3">
      <div className="flex flex-col gap-3">
        <div className="size-[45px] rounded-full bg-green-500" />
        <Spacer />
      </div>
      <div className="flex h-full flex-col gap-3">
        <ServerItem icon={BirdIcon} />
        <ServerItem icon={CatIcon} active />
        <ServerItem icon={DogIcon} />
        <ServerItem icon={FishIcon} />
        <ServerItem icon={RabbitIcon} />
      </div>
      <div className="flex flex-col">
        <button className="grid size-[45px] place-items-center rounded-md bg-neutral-500 text-neutral-100 transition-colors hover:bg-neutral-600">
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};
