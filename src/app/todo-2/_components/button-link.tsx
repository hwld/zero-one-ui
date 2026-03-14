import Link, { LinkProps } from "next/link";
import { ReactNode, forwardRef } from "react";
import { buttonBaseClass, buttonClass } from "./button";
import { cn } from "../../../lib/utils";

type Props = {
  children: ReactNode;
  variant?: "default" | "ghost";
  href: string;
  className?: string;
} & LinkProps;

export const ButtonLink = forwardRef<HTMLAnchorElement, Props>(function ButtonLink(
  { variant = "default", children, href, className, ...props },
  ref,
) {
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(buttonBaseClass, buttonClass[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
});
