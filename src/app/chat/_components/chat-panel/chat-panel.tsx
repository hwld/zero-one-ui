import { HashIcon, PlusCircleIcon, SendHorizontalIcon } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { ChatCard } from "./chat-card/chat-card";
import { EmptyChat } from "./empty-chat";

const chatInputName = "chat";

export const ChatPanel: React.FC = () => {
  const [chats, setChats] = useState<{ id: string; text: string }[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setChats((c) => [
      ...c,
      {
        id: crypto.randomUUID(),
        text: formData.get(chatInputName)!.toString(),
      },
    ]);

    Array.from(form.elements).forEach((e) => {
      if (e instanceof HTMLInputElement) {
        e.value = "";
      }
    });
  };

  return (
    <div className="grid grid-rows-[40px_1fr_70px] overflow-hidden bg-neutral-800">
      <div className="flex items-center gap-1 bg-white/10 p-5 text-sm">
        <HashIcon size={18} className="text-green-500" />
        <div>channnel</div>
      </div>
      <div className="flex flex-col gap-3 overflow-auto p-5">
        {chats.length === 0 && <EmptyChat />}
        {chats.map(({ id, text }) => (
          <ChatCard
            key={id}
            onDelete={() => {
              setChats((c) => c.filter((c) => c.id !== id));
            }}
          >
            {text}
          </ChatCard>
        ))}
      </div>
      <div className="flex items-center bg-transparent px-10">
        <form
          onSubmit={handleSubmit}
          className="flex h-[45px] w-full items-center gap-2 rounded-md bg-neutral-600 px-3 transition-shadow focus-within:ring-2 focus-within:ring-neutral-400 focus-within:ring-offset-2 focus-within:ring-offset-neutral-700"
        >
          <PlusCircleIcon className="text-green-500" />
          <input
            name={chatInputName}
            autoComplete="off"
            className="h-full w-full bg-transparent focus-visible:outline-hidden"
          />
          <SendHorizontalIcon className="text-green-500" />
        </form>
      </div>
    </div>
  );
};
