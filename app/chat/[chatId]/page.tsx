// app/chat/[chatId]/page.tsx

import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/models/Chat";
import  Message  from "@/models/Message";

type Props = {
  params: { chatId: string };
};

export default async function ChatPage({ params }: Props) {
  await connectToDatabase();

  const chat = await Chat.findById(params.chatId).lean();
  const messages = await Message.find({ chatId: params.chatId }).sort({ createdAt: 1 }).lean();

  if (!chat) return <div>Chat not found.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Chat with Seller</h2>
      <div className="border p-4 rounded bg-gray-100 space-y-2 max-h-[60vh] overflow-y-auto">
        {messages.map((msg: any, idx: number) => (
          <div key={idx} className="p-2 rounded bg-white shadow-sm">
            <p className="text-sm font-medium text-gray-700">{msg.senderId}</p>
            <p className="text-base">{msg.text}</p>
          </div>
        ))}
      </div>
      <form className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow border px-3 py-2 rounded"
          name="message"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#03B1AA] text-white rounded hover:bg-teal-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
