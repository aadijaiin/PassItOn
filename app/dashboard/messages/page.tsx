"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type ChatSummary = {
  _id: string;
  participants: string[];
  lastMessage: string | null;
  lastMessageTime: string;
};

export default function ChatListPage() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // 1. Fetch logged-in user's ID
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data?.user?.userId) setUserId(data.user.userId);
      });

    // 2. Fetch chat list
    fetch("/api/chat/list")
      .then(res => res.json())
      .then(setChats);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>

      {chats.length === 0 && <p className="text-gray-500">No chats yet.</p>}

      <div className="space-y-3">
        {chats.map(chat => {
          const otherUserId = chat.participants.find(p => p !== userId);

          return (
            <Link
              key={chat._id}
              href={`/chat/${chat._id}`}
              className="block p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              <div className="font-medium">User ID: {otherUserId}</div>
              <div className="text-gray-600 text-sm">
                {chat.lastMessage || "No messages yet"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
