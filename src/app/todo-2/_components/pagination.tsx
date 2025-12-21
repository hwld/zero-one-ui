import { usePagination } from "@mantine/hooks";
import clsx from "clsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

type Props = {
  total: number;
  page: number;
  onChangePage: (page: number) => void;
};
export const Pagination: React.FC<Props> = ({ total, page, onChangePage }) => {
  const pagination = usePagination({
    page,
    onChange: onChangePage,
    total,
  });

  const prevNextClass =
    "rounded-sm transition-colors enabled:hover:bg-white/20 disabled:text-zinc-500";

  return (
    <div className="flex gap-1">
      <button
        onClick={() => pagination.previous()}
        disabled={pagination.active === 1}
        className={prevNextClass}
      >
        <ChevronLeftIcon />
      </button>
      {pagination.range.map((r, i) => {
        const baseClass =
          "grid h-[25px] min-w-[25px] place-items-center rounded-sm text-sm";

        if (r === "dots") {
          return (
            <div className={baseClass} key={i}>
              <MoreHorizontalIcon size={18} />
            </div>
          );
        }
        return (
          <button
            key={i}
            className={clsx(
              baseClass,
              "transition-colors",
              pagination.active === r
                ? "bg-zinc-100 text-zinc-700"
                : "hover:bg-white/20",
            )}
            onClick={() => pagination.setPage(r)}
          >
            {r}
          </button>
        );
      })}
      <button
        onClick={() => pagination.next()}
        disabled={pagination.active === total}
        className={prevNextClass}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};
