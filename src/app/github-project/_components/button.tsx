import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type BaseProps = {
  color?: "primary" | "default" | "destructive";
  children: ReactNode;
  size?: "md" | "lg";
};

const baseClass = "rounded-md transition-colors disabled:opacity-50 flex items-center";

const colorClass = {
  default: "bg-neutral-800 border border-neutral-600 text-neutral-200 enabled:hover:bg-neutral-700",
  primary: "bg-green-700 border border-green-600 enabled:hover:bg-green-600 text-neutral-100",
  destructive:
    "bg-neutral-800 text-red-500 enabled:hover:bg-red-500 enabled:hover:text-neutral-100 border border-neutral-600 enabled:hover:border-red-500",
} satisfies Record<NonNullable<BaseProps["color"]>, string>;

const sizeClass = {
  md: "h-7 text-xs px-2",
  lg: "h-8 text-sm px-3",
} satisfies Record<NonNullable<BaseProps["size"]>, string>;

type ButtonProps = BaseProps & ComponentPropsWithoutRef<"button">;

export const Button: React.FC<ButtonProps> = ({
  color = "default",
  children,
  size = "md",
  ...props
}) => {
  return (
    <button {...props} className={clsx(baseClass, colorClass[color], sizeClass[size])}>
      {children}
    </button>
  );
};

type ButtonLinkProps = BaseProps & LinkProps & { external?: boolean };
export const ButtonLink: React.FC<ButtonLinkProps> = ({
  children,
  color = "default",
  size = "md",
  external,
  ...props
}) => {
  const className = clsx(baseClass, colorClass[color], sizeClass[size]);

  if (external) {
    return (
      <a href={props.href.toString()} className={className}>
        {children}
      </a>
    );
  } else {
    return (
      <Link {...props} className={className}>
        {children}
      </Link>
    );
  }
};
