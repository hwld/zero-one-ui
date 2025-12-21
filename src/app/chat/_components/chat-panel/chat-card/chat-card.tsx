import {
  MoreHorizontalIcon,
  ReplyIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { ChatCardMenuItem } from "./menu-item";

type Props = {
  children: ReactNode;
  onDelete?: () => void;
};

export const ChatCard: React.FC<Props> = ({ children, onDelete }) => {
  return (
    <div className="group relative grid min-h-fit grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] gap-x-3 gap-y-1 p-3">
      <div className="row-span-2 grid size-[40px] place-items-center rounded-full bg-neutral-700 text-green-500">
        <UserIcon />
      </div>
      <div className="flex items-center gap-3">
        <div>user-name</div>
        <div className="text-xs text-neutral-400">2024/02/11 11:11:11</div>
      </div>
      <div className="break-all">{children}</div>
      <div className="absolute top-0 right-0 hidden overflow-hidden rounded-sm bg-neutral-700 transition-opacity group-hover:flex">
        <ChatCardMenuItem icon={SmileIcon} label="絵文字をつける" />
        <ChatCardMenuItem icon={ReplyIcon} label="返信" />
        <ChatCardMenuItem icon={TrashIcon} label="削除" onClick={onDelete} />
        <ChatCardMenuItem icon={MoreHorizontalIcon} label="その他" />
      </div>
    </div>
  );
};
