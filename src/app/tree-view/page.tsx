"use client";

import clsx from "clsx";
import {
  TreeNodeType,
  TreeView,
  TreeViewNode,
  TreeViewNodeProps,
} from "./_components/tree-view";
import { ComponentPropsWithoutRef, useState } from "react";
import { createData } from "./_lib/data";
import { cn } from "../../lib/utils";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const bgClass = "bg-slate-50";

type TreeViewCardProps = {
  expandOnlyOnIconClick: boolean;
  data: TreeNodeType[];
  classNames: TreeViewNodeProps["classNames"];
} & ComponentPropsWithoutRef<"div">;

const TreeViewCard: React.FC<TreeViewCardProps> = ({
  expandOnlyOnIconClick,
  data,
  classNames,
  className,
  ...props
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "h-[500px] w-[300px] overflow-auto rounded-sm p-3",
        className,
      )}
      {...props}
    >
      <TreeView
        value={selected}
        onChange={setSelected}
        expandOnlyOnIconClick={expandOnlyOnIconClick}
      >
        {data.map((node) => (
          <TreeViewNode key={node.id} classNames={classNames} node={node} />
        ))}
      </TreeView>
    </div>
  );
};

const data1 = createData();
const data2 = createData();

const Page = () => {
  useBodyBgColor(bgClass);

  const [expandOnlyOnIconClick, setExpandOnlyOnIconClick] = useState(false);

  return (
    <div className={clsx(bgClass, "grid h-screen place-items-center")}>
      <div className="space-y-4">
        <div className="flex w-full items-center gap-1 rounded-sm border border-slate-300 p-2">
          <input
            type="checkbox"
            id="1"
            className="size-4 accent-slate-700"
            checked={expandOnlyOnIconClick}
            onChange={(e) => setExpandOnlyOnIconClick(e.target.checked)}
          />
          <label htmlFor="1" className="text-sm select-none">
            アイコンクリックでのみ開閉する
          </label>
        </div>
        <div className="flex gap-4">
          <TreeViewCard
            data={data1}
            expandOnlyOnIconClick={expandOnlyOnIconClick}
            className="border border-slate-300 bg-slate-100 text-slate-900"
            classNames={{
              selected: "bg-slate-300",
              groupFocus: "group-focus:border-slate-400",
              hover: "hover:bg-slate-300/40",
              hoverIcon: "hover:outline-solid outline-1 outline-slate-500",
            }}
          />
          <TreeViewCard
            data={data2}
            expandOnlyOnIconClick={expandOnlyOnIconClick}
            className="bg-slate-900 text-slate-100"
            style={{ colorScheme: "dark" }}
            classNames={{
              selected: "bg-slate-600",
              groupFocus: "group-focus:border-slate-500",
              hover: "hover:bg-slate-600/40",
              hoverIcon: "hover:outline-solid outline-1 outline-slate-300",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
