import { InboxIcon } from "lucide-react";
import { ViewCreateDialogTrigger } from "../view-create-dialog";
import { Button } from "../button";

export const NoViewContent: React.FC = () => {
  return (
    <div className="grid size-full min-h-fit place-content-center place-items-center gap-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <InboxIcon size={150} />
        <div className="text-center text-sm text-neutral-100">
          Viewが存在しません
        </div>
      </div>
      <ViewCreateDialogTrigger>
        <Button color="primary">Viewを作成</Button>
      </ViewCreateDialogTrigger>
    </div>
  );
};
