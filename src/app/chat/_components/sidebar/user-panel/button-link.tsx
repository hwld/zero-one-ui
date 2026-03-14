import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { userPanelButtonClass } from "./button";
import Link from "next/link";

type Props = { icon: LucideIcon; onClick?: () => void; href: string };

export const UserPanelButtonLink = forwardRef<HTMLAnchorElement, Props>(function UserMenuItem(
  { icon: Icon, onClick, href },
  ref,
) {
  return (
    <Link ref={ref} href={href} className={userPanelButtonClass} onClick={onClick}>
      <Icon size={20} />
    </Link>
  );
});
