import { LucideIcon } from "lucide-react";
import * as RadixSlider from "@radix-ui/react-slider";
import { forwardRef } from "react";

export const Slider: React.FC<{
  icon: LucideIcon;
  value: number;
  onChangeValue: (v: number) => void;
}> = ({ icon: Icon, value, onChangeValue }) => {
  return (
    <RadixSlider.Root
      className="relative flex w-full touch-none items-center select-none"
      max={100}
      step={1}
      value={[value]}
      onValueChange={(e) => onChangeValue(e[0])}
    >
      <RadixSlider.Track className="relative h-[30px] w-full grow overflow-hidden rounded-full bg-white/20">
        <RadixSlider.Range asChild className="absolute h-full bg-neutral-100">
          <CustomRange />
        </RadixSlider.Range>
        <div className="pointer-events-none absolute top-0 left-1 z-10 flex h-full items-center text-neutral-800">
          <Icon size={20} />
        </div>
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block size-[30px] rounded-full border border-neutral-300 bg-neutral-200 shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        aria-label="Volume"
      />
    </RadixSlider.Root>
  );
};

// Rangeの長さを調節して、Thumbとずれないようにする
const CustomRange = forwardRef<HTMLSpanElement, RadixSlider.SliderThumbProps>(
  function CustomRange({ style, ...others }, ref) {
    const right =
      parseFloat(style?.right?.toString().split("calc(")[0] ?? "0") ?? 0;
    const delta = `${(right - 50) / 4}px`;
    const newRight = `calc(${right}% - (${delta}))`;

    return <span ref={ref} {...others} style={{ ...style, right: newRight }} />;
  },
);
