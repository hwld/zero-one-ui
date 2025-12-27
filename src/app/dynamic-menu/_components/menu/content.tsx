import { useEffect, useState } from "react";
import { NextMenuItem } from "./next-item";
import { MenuItem } from "./item";
import { PrevMenuItem } from "./prev-item";
import { AnnoyedIcon, LaughIcon } from "lucide-react";
import { motion } from "motion/react";
import clsx from "clsx";

const initialMenu = [...new Array(3)].map(
  (_, i) => `長いメニューアイテム${i + 1}`,
);
const slimMenu = [...new Array(6)].map((_, i) => `メニュー${i + 1}`);

type Props = {
  page: 1 | 2;
  onPageChange: (page: 1 | 2) => void;
};

export const MenuContent: React.FC<Props> = ({ page, onPageChange }) => {
  // マウント時にはレイアウトアニメーションを実行させたくない。
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // 少し遅延させて、レイアウトアニメーションが実行されないようにする
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    return () => onPageChange(1);
  }, [onPageChange]);

  const content = {
    1: (
      <>
        {initialMenu.map((item, i) => {
          return (
            <MenuItem key={i} icon={AnnoyedIcon}>
              {item}
            </MenuItem>
          );
        })}
        <NextMenuItem onClick={() => onPageChange(2)} />
      </>
    ),
    2: (
      <>
        <PrevMenuItem onClick={() => onPageChange(1)} />
        {slimMenu.map((item, i) => {
          return (
            <MenuItem key={i} icon={LaughIcon}>
              {item}
            </MenuItem>
          );
        })}
      </>
    ),
  };

  return (
    <motion.div
      key={String(mounted)}
      // マウント後の最初のレンダリングではfalseになる
      layout={mounted}
      className={clsx("flex flex-col gap-1 overflow-hidden bg-neutral-200 p-3")}
      style={{ borderRadius: "8px" }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {content[page]}
    </motion.div>
  );
};
