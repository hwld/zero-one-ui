import clsx from "clsx";

type Props = { size?: number | string | undefined; className?: string };
export const Avatar: React.FC<Props> = ({ size = 32, className }) => {
  return (
    <div
      className={clsx(
        "rounded-full bg-linear-to-br from-teal-500 to-green-500",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
};
