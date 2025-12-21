import { IconCommand, IconPlus } from "@tabler/icons-react";
import { TaskAddDialog } from "./task-add-dialog";
import { useEffect, useState } from "react";
import { Button } from "./button";

export const TaskAddButton: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddTask = () => {
    setIsAddDialogOpen(true);
  };

  useEffect(() => {
    const openAddDialog = (e: KeyboardEvent) => {
      const cmdK = e.metaKey && e.key === "k";
      const ctrlK = e.ctrlKey && e.key === "k";
      if (cmdK || ctrlK) {
        e.stopPropagation();
        e.preventDefault();
        setIsAddDialogOpen(true);
      }
    };
    window.addEventListener("keydown", openAddDialog);
    return () => window.removeEventListener("keydown", openAddDialog);
  }, []);

  return (
    <>
      <Button onClick={handleAddTask}>
        <div className="flex items-center">
          <IconPlus size={15} className="mb-px" />
          <p className="text-xs">タスクを追加する</p>
        </div>
        <div className="flex items-center rounded-sm bg-white/20 px-1 text-zinc-300 transition-colors">
          <IconCommand size={13} />
          <p className="text-[10px]">K</p>
        </div>
      </Button>
      <TaskAddDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
};
