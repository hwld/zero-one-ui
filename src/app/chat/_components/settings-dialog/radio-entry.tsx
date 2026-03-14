import { SettingRadioGroup, SettingRadioItem } from "./radio";

export type RadioSetting = {
  name: string;
  description: string;
  items: SettingRadioItem[];
};

type Props = { setting: RadioSetting };

export const RadioSettingEntry: React.FC<Props> = ({ setting: { name, description, items } }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div>{name}</div>
        <div className="text-sm text-neutral-300">{description}</div>
      </div>
      <SettingRadioGroup items={items} />
    </div>
  );
};
