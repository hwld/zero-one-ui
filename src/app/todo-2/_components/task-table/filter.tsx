import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import {
  BoxSelectIcon,
  CheckIcon,
  CheckSquareIcon,
  CircleDashedIcon,
  CircleDotIcon,
  FilterIcon,
  LucideIcon,
  XIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { FieldFilter } from "../../_backend/api";
import clsx from "clsx";
import { Button } from "../button";
import { useTaskTableFilter } from "./filter-provider";

type FieldFilterContent = FieldFilter & { label: string; icon: LucideIcon };

const allStatusFilterContents = [
  {
    id: crypto.randomUUID(),
    type: "field",
    field: "status",
    value: "todo",
    label: "Todo",
    icon: CircleDashedIcon,
  },
  {
    id: crypto.randomUUID(),
    type: "field",
    field: "status",
    value: "done",
    label: "Done",
    icon: CircleDotIcon,
  },
] satisfies FieldFilterContent[];

export const TaskTableFilter: React.FC = () => {
  const {
    fieldFilters,
    selectionFilter,

    addFieldFilter,
    removeFieldFilter,
    removeAllFilter,
    setSelectionFilter,
  } = useTaskTableFilter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filtered = fieldFilters.length > 0 || selectionFilter !== null;
  const filterCount = fieldFilters.length + (selectionFilter !== null ? 1 : 0);

  return (
    <DropdownMenu
      open={isFilterOpen}
      onOpenChange={setIsFilterOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button>
          <FilterIcon size={15} />
          <p className="mt-px whitespace-nowrap">絞り込み</p>
          {filtered && (
            <div className="size-[16px] rounded-full bg-white/30 text-zinc-100">
              {filterCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isFilterOpen && (
          <DropdownMenuPortal forceMount>
            <DropdownMenuContent
              asChild
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <motion.div
                className="flex w-[200px] flex-col gap-1 rounded-sm border border-zinc-600 bg-zinc-700 p-1 text-zinc-200"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <FilterGroup label="状況">
                  {allStatusFilterContents.map((filter, i) => {
                    const isSelected = !!fieldFilters.find(
                      (f) => f.id === filter.id,
                    );

                    const handleSelect = () => {
                      if (isSelected) {
                        removeFieldFilter(filter.id);
                      } else {
                        addFieldFilter(filter);
                      }
                    };

                    return (
                      <FilterItem
                        key={i}
                        label={filter.label}
                        icon={filter.icon}
                        isSelected={isSelected}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </FilterGroup>

                <FilterGroup label="選択">
                  <FilterItem
                    label="選択済み"
                    icon={CheckSquareIcon}
                    isSelected={selectionFilter === "selected"}
                    onSelect={() => {
                      setSelectionFilter("selected");
                    }}
                  />
                  <FilterItem
                    label="未選択"
                    icon={BoxSelectIcon}
                    isSelected={selectionFilter === "unselected"}
                    onSelect={() => {
                      setSelectionFilter("unselected");
                    }}
                  />
                </FilterGroup>

                <div className="w-full space-y-1">
                  <div className="h-px w-full bg-zinc-600" />
                  <Button
                    role="menuitem"
                    variant="ghost"
                    className="w-full"
                    onClick={removeAllFilter}
                    disabled={!filtered}
                  >
                    <XIcon size={16} />
                    絞り込みを解除する
                  </Button>
                </div>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};

const FilterGroup: React.FC<{ children: ReactNode; label: string }> = ({
  children,
  label,
}) => {
  return (
    <div>
      <p className="p-1 text-xs text-zinc-400">{label}</p>
      <div>{children}</div>
    </div>
  );
};

type FilterItemProps = {
  label: string;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: () => void;
};
const FilterItem: React.FC<FilterItemProps> = ({
  label,
  icon: Icon,
  isSelected = true,
  onSelect,
}) => {
  const handleSelect = (e: Event) => {
    e.preventDefault();
    onSelect();
  };

  return (
    <DropdownMenuItem
      asChild
      className="focus-visible:bg-white/15 focus-visible:outline-hidden"
      onSelect={handleSelect}
    >
      <Button variant="ghost" className="w-full">
        <div className="flex grow items-center gap-1 select-none">
          <Icon size={12} />
          <p>{label}</p>
        </div>
        <div
          className={clsx(
            "grid size-[16px] appearance-none place-items-center overflow-hidden rounded-sm border border-zinc-500",
            isSelected ? "bg-zinc-100" : "bg-transparent",
          )}
        >
          {isSelected && (
            <CheckIcon className="text-zinc-700" size={12} strokeWidth={3} />
          )}
        </div>
      </Button>
    </DropdownMenuItem>
  );
};
