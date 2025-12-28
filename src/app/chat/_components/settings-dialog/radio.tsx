import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

export type SettingRadioItem = {
  value: string;
  label: string;
  description?: string;
};

type Props = { items: SettingRadioItem[] };

export const SettingRadioGroup: React.FC<Props> = ({ items }) => {
  const [selectedValue, setSelectedValue] = useState(items[0]?.value ?? "");

  return (
    <RadioGroup.Root
      className="grid gap-2"
      value={selectedValue}
      onValueChange={setSelectedValue}
    >
      {items.map((item) => {
        return (
          <SettingRadio
            key={item.value}
            item={item}
            isSelected={selectedValue === item.value}
            onSelect={setSelectedValue}
          />
        );
      })}
    </RadioGroup.Root>
  );
};

type RadioProps = {
  isSelected: boolean;
  item: SettingRadioItem;
  onSelect: (value: string) => void;
};
const SettingRadio: React.FC<RadioProps> = ({ isSelected, item, onSelect }) => {
  return (
    <div
      className={clsx(
        "flex cursor-pointer items-center rounded-sm p-4 transition-colors",
        isSelected
          ? "bg-white/20 outline-2 outline-green-400 outline-solid"
          : "bg-white/10 hover:bg-white/15"
      )}
      onClick={() => onSelect(item.value)}
    >
      <RadioGroup.Item
        value={item.value}
        className={clsx(
          "grid size-[24px] place-items-center rounded-full border-2",
          isSelected ? "border-green-400" : "border-neutral-100"
        )}
      >
        <AnimatePresence>
          {isSelected && (
            <RadioGroup.Indicator asChild forceMount>
              <motion.span
                className="size-[12px] rounded-full bg-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            </RadioGroup.Indicator>
          )}
        </AnimatePresence>
      </RadioGroup.Item>
      <div className="gap-1 pl-4">
        <label>{item.label}</label>
        {item.description && (
          <div className="text-sm text-neutral-300">{item.description}</div>
        )}
      </div>
    </div>
  );
};
