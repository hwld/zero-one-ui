import { IconCommand, IconPlus } from "@tabler/icons-react";
import { TaskAddDialog } from "./task-add-dialog";
import { useEffect, useState } from "react";

export const AddTaskButton: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTask = () => {
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    const openAddDialog = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        setIsAddDialogOpen(true);
      }
    };
    window.addEventListener("keydown", openAddDialog);
    return () => window.removeEventListener("keydown", openAddDialog);
  }, []);

  return (
    <>
      <button
        className="group flex h-8 w-fit shrink-0 items-center gap-2 rounded bg-zinc-300 px-2 text-zinc-700 transition-colors hover:bg-zinc-400"
        onClick={handleAddTask}
      >
        <div className="flex items-center">
          <IconPlus size={15} className="mb-[1px]" />
          <p className="text-xs">タスクを追加する</p>
        </div>
        <div className="flex items-center rounded bg-black/15 px-1 py-[2px] text-zinc-700 transition-colors">
          <IconCommand size={15} />
          <p className="mt-[1px] text-[12px]">K</p>
        </div>
      </button>
      <TaskAddDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
};
