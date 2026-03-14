import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"label">;

export const Label: React.FC<Props> = ({ htmlFor, ...props }) => {
  return <label htmlFor={htmlFor} {...props} className="font-bold" />;
};
