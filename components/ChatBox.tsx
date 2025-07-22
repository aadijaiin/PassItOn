"use client";

import React, { useEffect, useRef, useState } from "react";
import useSocket from "@/hooks/useSocket";

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
};

type Props = {
  currentUserId: string;
  chatPartnerId: string;
};

export default function ChatBox({ currentUserId, chatPartnerId }: Props) {
  const socket = useSocket(currentUserId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/messages?user1=${currentUserId}&user2=${chatPartnerId}`
        );
        if (!res.ok) {
          console.error("Failed to fetch messages:", res.status);
          return;
        }

        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [currentUserId, chatPartnerId]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg: Message) => {
      const isForThisChat =
        (msg.senderId === chatPartnerId && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === chatPartnerId);

      if (isForThisChat) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, currentUserId, chatPartnerId]);

  // Send a message
  const sendMessage = () => {
    if (!socket || !input.trim()) return;

    const message = {
      senderId: currentUserId,
      receiverId: chatPartnerId,
      content: input.trim(),
    };

    socket.emit("send-message", message);

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        _id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);

    setInput("");
  };

  return (
    <div className="p-4 border rounded-xl shadow max-w-lg mx-auto">
      <div className="h-64 overflow-y-auto border-b mb-4 px-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={msg._id || `${msg.senderId}-${index}`}
            className={`max-w-[70%] p-2 rounded-md ${
              msg.senderId === currentUserId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border rounded px-3 py-1"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
