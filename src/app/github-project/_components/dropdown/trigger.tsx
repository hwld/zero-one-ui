import { Slot } from "@radix-ui/react-slot";
import { useDropdown } from "./provider";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { useMergeRefs } from "@floating-ui/react";

export const DropdownTrigger = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<"button">>(
  function DropdownTrigger(props, outerRef) {
    const { refs, getReferenceProps } = useDropdown();

    const mergedRef = useMergeRefs([refs.setReference, outerRef]);

    return <Slot ref={mergedRef} {...props} {...getReferenceProps()} />;
  },
);
