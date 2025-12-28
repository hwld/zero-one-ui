import type { IconType } from "@react-icons/all-files";
import { PiSpinnerGapBold } from "@react-icons/all-files/pi/PiSpinnerGapBold";
import { AnimatePresence, motion } from "motion/react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  slots: {
    base: "relative flex items-center rounded-sm text-nowrap ring-offset-2 transition-all select-none focus-visible:ring-2 focus-visible:outline-hidden active:scale-95",
  },
  variants: {
    size: {
      md: { base: "h-8 px-3 text-sm font-medium" },
      sm: { base: "h-6 px-2 text-xs" },
    },
    color: {
      primary: {
        base: "bg-rose-700 text-stone-100 ring-rose-400 hover:bg-rose-800",
      },
      secondary: {
        base: "bg-stone-200 text-stone-700 ring-stone-500 hover:bg-stone-300",
      },
      transparent: {
        base: "text-stone-500 ring-stone-500 hover:bg-stone-500/10 hover:text-stone-900",
      },
    },
    loading: {
      true: "pointer-events-none",
      false: "disabled:pointer-events-none disabled:opacity-50",
    },
  },
});

type Props = {
  leftIcon?: IconType;
  rightIcon?: IconType;
} & VariantProps<typeof button> &
  Omit<ComponentPropsWithoutRef<"button">, "className">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    size = "md",
    color = "primary",
    loading = false,
    children,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    ...props
  },
  ref,
) {
  const classes = button({ size, color, loading });

  return (
    <button ref={ref} className={classes.base()} {...props}>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 grid size-full animate-spin place-items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PiSpinnerGapBold className="size-[70%]" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="flex items-center gap-1"
        initial={loading ? { opacity: 0, y: 10 } : false}
        animate={loading ? { opacity: 0 } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        {LeftIcon ? <LeftIcon className="size-4 shrink-0" /> : null}
        {children}
        {RightIcon ? <RightIcon className="size-4 shrink-0" /> : null}
      </motion.div>
    </button>
  );
});

type ButtonLinkProps = { children: ReactNode } & LinkProps &
  VariantProps<typeof button>;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { color = "primary", size = "md", loading = false, children, ...props },
    ref,
  ) {
    const classes = button({ color, size, loading });

    return (
      <Link ref={ref} {...props} className={classes.base()}>
        {children}
      </Link>
    );
  },
);
