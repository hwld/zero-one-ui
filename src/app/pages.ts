import {
  CircleEllipsisIcon,
  FullscreenIcon,
  KanbanSquareIcon,
  LayoutListIcon,
  LucideIcon,
  MessageSquareMoreIcon,
  RectangleEllipsisIcon,
  TablePropertiesIcon,
} from "lucide-react";

type Tag = "PC" | "MOBILE" | "LAYOUT" | "PART" | "WIP";
export type PageLink =
  | "/"
  | "/todo-1"
  | "/todo-2"
  | "/dynamic-menu"
  | "/chat"
  | "/dynamic-island"
  | "/continuty-transition"
  | "/github-project";

export type Page = {
  icon: LucideIcon;
  href: PageLink;
  title: string;
  description: string;
  tags: Tag[];
};

export const pages: Page[] = [
  {
    icon: LayoutListIcon,
    href: "/todo-1",
    title: "todoリスト",
    description:
      "浮いてるinputを使ったTodoリスト。\ninputの隣のメニューがお気に入り。",
    tags: ["PC", "MOBILE", "LAYOUT"],
  },
  {
    icon: TablePropertiesIcon,
    href: "/todo-2",
    title: "todoリスト2",
    description:
      "表形式のtodoリスト。\nテーブルの部分だけカードになっているのがお気に入り。",
    tags: ["PC", "LAYOUT"],
  },
  {
    icon: CircleEllipsisIcon,
    href: "/dynamic-menu",
    title: "変形するメニュー",
    description: "youtubeの設定メニューを見て作りたくなった。\n🥱🥱🥱😀😀😀",
    tags: ["PC", "MOBILE", "PART"],
  },
  {
    icon: MessageSquareMoreIcon,
    href: "/chat",
    title: "チャット",
    description:
      "DiscordみたいなUI。\n設定ページを初めて作ったが、項目が多いとレイアウトが大変そうだなぁと思った。",
    tags: ["PC", "LAYOUT"],
  },
  {
    icon: RectangleEllipsisIcon,
    href: "/dynamic-island",
    title: "変形するメニュー2",
    description:
      "Dynamic Islandみたいなメニュー。\nframer-motionでspring animationを使ってみた。",
    tags: ["PC", "MOBILE", "PART"],
  },
  {
    icon: FullscreenIcon,
    href: "/continuty-transition",
    title: "ページトランジション",
    description:
      "モバイルでよくありそうなページトランジションをWebで作ってみた。",
    tags: ["PC", "MOBILE", "LAYOUT"],
  },
  {
    icon: KanbanSquareIcon,
    href: "/github-project",
    title: "GitHub Project",
    description: "GitHubのProjectsのレイアウトを作ってみた。",
    tags: ["PC", "LAYOUT", "WIP"],
  },
];
