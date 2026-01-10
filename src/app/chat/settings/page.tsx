"use client";
import { useRouter } from "next/navigation";
import { SettingsDialog } from "../_components/settings-dialog/settings-dialog";
import { useAnimate } from "motion/react";

const SettingModalPage: React.FC = () => {
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      return;
    }

    await animate(scope.current, { opacity: 0, scale: 0.95 });
    router.replace("/chat");
  };

  return (
    <SettingsDialog
      ref={scope}
      onOpenChange={handleOpenChange}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    />
  );
};

export default SettingModalPage;
