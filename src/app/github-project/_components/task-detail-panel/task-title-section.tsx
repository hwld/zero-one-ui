import { Button } from "../button";
import { Task } from "../../_backend/task/store";
import { useState } from "react";
import { TaskTitleForm } from "./task-title-form";

export const TaskTitleSection: React.FC<{ task: Task }> = ({ task }) => {
  const [isEditable, setIsEditable] = useState(false);

  const enableEditing = () => {
    setIsEditable(true);
  };

  const disableEditing = () => {
    setIsEditable(false);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      {isEditable ? (
        <>
          <TaskTitleForm task={task} onCancel={disableEditing} onAfterSubmit={disableEditing} />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <Button onClick={enableEditing}>Edit title</Button>
        </>
      )}
    </div>
  );
};
