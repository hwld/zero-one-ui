import { Dialog, DialogClose, DialogContent } from "@radix-ui/react-dialog";
import { Target, motion } from "framer-motion";
import { SettingsSidebar } from "./sidebar";
import { Spacer } from "../spacer";
import { XCircleIcon } from "lucide-react";
import { ReactNode, forwardRef } from "react";
import { SwitchSettingEntry } from "./switch-entry";
import { radioSettings, switchSettings } from "./data";
import { RadioSettingEntry } from "./radio-entry";
import { ProfileForm } from "./profile-form";

type Props = {
  onOpenChange: (open: boolean) => void;
  initial: Target;
  animate: Target;
};

export const SettingsDialog = forwardRef<HTMLDivElement, Props>(
  function SettingsDialog({ onOpenChange, animate, initial }, ref) {
    return (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent
          asChild
          onOpenAutoFocus={(e) => e.preventDefault()}
          forceMount
        >
          <motion.div
            ref={ref}
            className="fixed inset-0 grid grid-cols-[30%_1fr] bg-neutral-950 text-neutral-100 focus-visible:outline-hidden"
            initial={initial}
            animate={animate}
            style={{ colorScheme: "dark" }}
          >
            <SettingsSidebar />
            <div className="grid grid-cols-[700px_50px] justify-start gap-8 overflow-auto bg-neutral-700 px-6 py-14">
              <div className="flex h-full flex-col gap-8">
                <h1 className="text-lg font-bold">プロフィール</h1>
                <div className="flex flex-col gap-10">
                  <ProfileForm />
                  <Spacer />
                  <SettingGroup group="サーバーのデフォルトプライバシー設定">
                    {switchSettings.map((s) => {
                      return <SwitchSettingEntry key={s.name} setting={s} />;
                    })}
                  </SettingGroup>
                  <Spacer />
                  <SettingGroup group="ダイレクトメッセージフィルター">
                    {radioSettings.map((s) => {
                      return <RadioSettingEntry key={s.name} setting={s} />;
                    })}
                  </SettingGroup>
                </div>
              </div>
              <div>
                <DialogClose className="sticky top-0 flex flex-col items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-100">
                  <XCircleIcon size={45} strokeWidth={2} />
                  <div className="text-sm">ESC</div>
                </DialogClose>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  },
);

const SettingGroup: React.FC<{ group: string; children: ReactNode }> = ({
  group,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-xs text-neutral-300">{group}</div>
      <div className="space-y-8">{children}</div>
    </div>
  );
};
