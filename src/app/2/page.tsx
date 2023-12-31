"use client";

import {
  IconCalendar,
  IconCheckbox,
  IconCircleCheck,
  IconClipboard,
  IconClipboardText,
  IconClockCheck,
  IconClockHour4,
  IconClockHour5,
  IconCommand,
  IconGridDots,
  IconHome,
  IconListDetails,
  IconPencil,
  IconPlus,
  IconRotate,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Page: NextPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    setTasks((prev) => [
      {
        id: Math.random().toString(),
        title: "new task",
        done: false,
        createdAt: new Date().toLocaleString(),
        completedAt: "",
      },
      ...prev,
    ]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      className={clsx(
        inter.className,
        "flex min-h-[100dvh] bg-gray-900 text-gray-200",
      )}
    >
      <div className="sticky top-0 h-[100dvh] pl-5 pt-5">
        <Sidebar />
      </div>
      <div className="m-5 flex w-full flex-col p-3">
        <div className="flex items-end justify-between">
          <div className="flex flex-nowrap items-center gap-1">
            <IconHome size={18} />
            <h1 className="text-sm">今日のタスク</h1>
          </div>
        </div>
        <div className="mt-3 flex w-full  grow flex-col gap-2 rounded-lg bg-gray-800 p-3 shadow-2xl">
          <AddTaskButton onClick={handleAddTask} />
          <TaskTable tasks={tasks} onDeleteTask={handleDeleteTask} />
        </div>
      </div>
    </div>
  );
};

export default Page;

const Sidebar: React.FC = () => {
  return (
    <div className="flex w-[180px] flex-col">
      <div className="flex items-center gap-1 whitespace-nowrap text-sm font-bold">
        <IconCircleCheck />
        <p>evodo-openapi</p>
      </div>
      <div className="mt-6 flex flex-col gap-1">
        <SidebarItem icon={IconHome} label="今日のタスク" />
        <SidebarItem icon={IconListDetails} label="過去のタスク" />
        <SidebarItem icon={IconCalendar} label="予定" />
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{
  icon: React.FC<{ size?: number }>;
  label: string;
}> = ({ icon: Icon, label }) => {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap rounded-md p-2 text-sm text-gray-200 hover:bg-white/20">
      <Icon size={25} />
      <p>{label}</p>
    </div>
  );
};

const AddTaskButton: React.FC<ComponentPropsWithoutRef<"button">> = ({
  onClick,
}) => {
  return (
    <button
      className="group flex w-fit items-center gap-3 rounded bg-gray-200 px-2  py-1 text-gray-700 transition-colors hover:bg-gray-300"
      onClick={onClick}
    >
      <div className="flex items-center">
        <IconPlus size={15} />
        <p className="text-[12px]">タスクを追加する</p>
      </div>
      <div className="flex items-center rounded bg-gray-300 p-1 text-gray-500 transition-colors group-hover:bg-gray-300">
        <IconCommand size={15} />
        <p className="mt-[1px] text-[12px]">K</p>
      </div>
    </button>
  );
};

type TableProps = { tasks: Task[]; onDeleteTask: (id: string) => void };
const TaskTable: React.FC<TableProps> = ({ tasks, onDeleteTask }) => {
  return (
    <table className="table w-full border-collapse border text-left">
      <thead className="text-xs">
        <tr>
          <TableHeader icon={IconClipboardText} text="タスク名" />
          <TableHeader icon={IconCheckbox} width={80} text="状況" />
          <TableHeader icon={IconClockHour5} width={200} text="作成日" />
          <TableHeader icon={IconClockCheck} width={200} text="達成日" />
          <TableHeader icon={IconGridDots} width={150} text="操作" />
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 && <EmptyTableRow />}
        {tasks.map((task) => {
          return (
            <TaskTableRow
              key={task.id}
              task={task}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </tbody>
    </table>
  );
};

const TableHeader: React.FC<{
  icon?: React.FC<{ size?: number; className?: string }>;
  text: string;
  width?: number;
}> = ({ icon: Icon, text, width }) => {
  return (
    <th
      className="whitespace-nowrap border border-gray-600 bg-black/10 px-2 py-1 font-medium"
      style={{ width }}
    >
      <div className="flex items-center gap-1 text-gray-300">
        {Icon && <Icon size={20} className="text-gray-400" />}
        <p>{text}</p>
      </div>
    </th>
  );
};

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  completedAt: string;
};
const TaskTableRow: React.FC<{
  task: Task;
  onDeleteTask: (id: string) => void;
}> = ({ task: { id, title, done, createdAt, completedAt }, onDeleteTask }) => {
  const handleDelete = () => {
    onDeleteTask(id);
  };

  return (
    <tr className="transition-colors hover:bg-white/5">
      <TaskTableData>{title}</TaskTableData>
      <TaskTableData noWrap>{done ? "完了" : "未完了"}</TaskTableData>
      <TaskTableData noWrap>{createdAt}</TaskTableData>
      <TaskTableData noWrap>{completedAt}</TaskTableData>
      <TaskTableData>
        <div className="flex gap-2">
          <button className="border border-gray-600 px-2 py-1 text-xs  text-gray-300 transition-colors hover:bg-gray-500">
            <IconPencil size={16} />
          </button>
          <button
            className="border border-gray-600 px-2 py-1 text-xs  text-gray-300 transition-colors hover:bg-gray-500"
            onClick={handleDelete}
          >
            <IconTrash size={16} />
          </button>
        </div>
      </TaskTableData>
    </tr>
  );
};

const EmptyTableRow: React.FC = () => {
  return (
    <tr className="border border-gray-600">
      <td colSpan={6}>
        <div className="flex h-[400px] w-full items-center justify-center">
          <div className="flex w-[300px] flex-col items-center text-center">
            <IconClipboardText size={100} />
            <p className="mt-3 text-lg font-bold">
              今日やるべきことなんですか？
            </p>
            <p className="mt-1 w-[230px] text-sm text-gray-300">
              `Cmd+K`または`Ctrl+K`でタスクの入力を開始できます。。
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};

const TaskTableData: React.FC<{ children: ReactNode; noWrap?: boolean }> = ({
  children,
  noWrap,
}) => {
  return (
    <td
      className={clsx(
        "border border-gray-600  px-2 py-1 text-sm",
        noWrap && "whitespace-nowrap",
      )}
    >
      <div className="">{children}</div>
    </td>
  );
};
