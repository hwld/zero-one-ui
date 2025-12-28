import { ChevronDownIcon } from "lucide-react";
import { ViewColumn } from "../../_backend/view/api";
import { SlicerListItem } from "./item";
import { SliceByMenuTrigger } from "./slice-by-menu-trigger";

type Props = { columns: ViewColumn[] };

export const SlicerPanel: React.FC<Props> = ({ columns }) => {
  return (
    <div className="flex size-full shrink-0 flex-col gap-2 overflow-auto p-4">
      <SliceByMenuTrigger>
        <button className="flex h-8 w-fit shrink-0 items-center gap-1 rounded-md px-2 text-sm hover:bg-white/10">
          <span>Status</span>
          <ChevronDownIcon size={16} />
        </button>
      </SliceByMenuTrigger>
      <ul className="w-full [&>li:last-child]:border-b-0">
        {columns.map((column) => {
          return <SlicerListItem key={column.statusId} column={column} />;
        })}
      </ul>
    </div>
  );
};
