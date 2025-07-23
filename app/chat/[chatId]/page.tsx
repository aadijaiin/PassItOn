import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/models/Chat";
import {Message} from "@/models/Message";
import ChatClient from "./ChatClient";
import { headers } from "next/headers";
import type { Message as MessageType } from "@/types/message";
import type { Types } from "mongoose";

type Props = {
  params: { chatId: string };
};

type LeanChat = {
  _id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};

export default async function ChatPage(props: Props) {
  await connectToDatabase();

  const { chatId } = await props.params;

  const chatDoc = await Chat.findById(chatId).lean<{
    _id: Types.ObjectId;
    participants: (string | Types.ObjectId)[];
    createdAt: Date;
    updatedAt: Date;
  }>();

  if (!chatDoc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Chat not found</h2>
          <p className="text-gray-600">Sorry, the chat you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const chat: LeanChat = {
    _id: chatDoc._id.toString(),
    participants: chatDoc.participants.map((p) =>
      typeof p === "string" ? p : p.toString()
    ),
    createdAt: chatDoc.createdAt.toISOString(),
    updatedAt: chatDoc.updatedAt.toISOString(),
  };

  // ✅ Don't await headers() — it's synchronous
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  const meRes = await fetch("http://localhost:3000/api/auth/me", {
    headers: {
      Cookie: cookie,
    },
    cache: "no-store",
  });

  const meJson = await meRes.json();

  // ✅ Extract `id` from `meJson.user`
  const currentUserId = meJson.user?.userId;

  // ✅ Ensure currentUserId exists
  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Authentication error</h2>
          <p className="text-gray-600">You must be logged in to access this chat.</p>
        </div>
      </div>
    );
  }

  const receiverId =
    chat.participants[0] === currentUserId
      ? chat.participants[1]
      : chat.participants[0];

  const rawMessages = await Message.find({ chatId })
    .sort({ timestamp: 1 })
    .lean<MessageType[]>();

  const messages: MessageType[] = rawMessages.map((m) => ({
  _id: m._id.toString(),
  senderId: m.senderId.toString(),
  receiverId: m.receiverId.toString(),
  content: m.content,
  timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : new Date().toISOString(),
  read: m.read,
}));


  console.log("Parent senderId:", currentUserId, "receiverId:", receiverId);

  return (
    <ChatClient
      chatId={chatId}
      initialMessages={messages}
      receiverId={receiverId}
      senderId={currentUserId}
    />
  );
}
