import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, XIcon } from "lucide-react";
import { TaskCreateForm } from "./task-form/task-create-form";
import { useState } from "react";
import { useAddTask } from "../_queries/use-add-task";
import { Button } from "./button";
import { CreateTaskInput } from "../_backend/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const taskFormId = "task-form-id";

type Props = { isOpen: boolean; onOpenChange: (open: boolean) => void };
export const TaskAddDialog: React.FC<Props> = ({ isOpen, onOpenChange }) => {
  const [formkey, setFormKey] = useState(crypto.randomUUID());
  const [moreAdd, setmoreAdd] = useState(false);
  const addTaskMutation = useAddTask();

  const handleAddTask = (data: CreateTaskInput) => {
    addTaskMutation.mutate({
      title: data.title,
      description: data.description,
    });
    setFormKey(crypto.randomUUID());

    if (!moreAdd) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              ></motion.div>
            </DialogOverlay>
            <DialogContent asChild aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
                className="fixed top-1/2 left-1/2 w-full max-w-[550px] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100"
              >
                <div className="flex justify-between p-4">
                  <DialogTitle className="grid place-items-center rounded-sm bg-zinc-700 px-2 text-xs text-zinc-400 select-none">
                    New Task
                  </DialogTitle>
                  <DialogClose className="grid size-[25px] place-items-center rounded-sm transition-colors hover:bg-white/10">
                    <XIcon size={20} />
                  </DialogClose>
                </div>
                <TaskCreateForm
                  key={formkey}
                  id={taskFormId}
                  onAddTask={handleAddTask}
                />
                <div className="h-px w-full bg-zinc-700" />
                <div className="flex justify-end gap-4 p-3">
                  <div className="flex items-center gap-2">
                    <input
                      checked={moreAdd}
                      onChange={() => setmoreAdd((s) => !s)}
                      type="checkbox"
                      id="switch"
                      className="relative block h-[20px] w-[35px] cursor-pointer appearance-none rounded-full bg-zinc-500 before:absolute before:top-[3px] before:h-[14px] before:w-[14px] before:translate-x-[3px] before:rounded-full before:bg-zinc-100 before:transition-transform before:content-[''] checked:bg-green-500 checked:before:translate-x-[18px]"
                    />
                    <label htmlFor="switch" className="cursor-pointer text-xs">
                      続けて作成する
                    </label>
                  </div>
                  <Button type="submit" form={taskFormId}>
                    <PlusIcon size={15} />
                    作成する
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
