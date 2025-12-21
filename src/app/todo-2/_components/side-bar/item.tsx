import clsx from "clsx";
import Link from "next/link";

export const SidebarItem: React.FC<{
  icon: React.FC<{ size?: number }>;
  label: string;
  active?: boolean;
  path: string;
}> = ({ icon: Icon, label, active, path }) => {
  return (
    <Link
      href={path}
      className={clsx(
        "flex cursor-pointer items-center gap-1 rounded-md border-zinc-600 p-2 text-sm whitespace-nowrap transition-colors",
        active
          ? "border bg-zinc-700 text-zinc-100 shadow-2xl"
          : "text-zinc-200 hover:bg-white/10",
      )}
    >
      <Icon size={18} />
      <p>{label}</p>
    </Link>
  );
};
