"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/message";

type Props = {
  senderId: string;
  receiverId: string;
  chatId: string;
  initialMessages: Message[];
};

export default function ChatClient({
  senderId,
  receiverId,
  chatId,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?user1=${senderId}&user2=${receiverId}`);
        if (!res.ok) return console.error("Polling failed:", await res.text());
        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const body = {
      senderId,
      receiverId,
      chatId,
      content: newMessage.trim(),
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Failed to send:", await res.text());
        return;
      }

      const saved = await res.json();
      setMessages((prev) => [...prev, saved]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#7C3AED] text-white px-6 py-4 text-lg font-semibold shadow">
        Chat with Seller
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 px-4 py-4 overflow-y-auto space-y-3"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`w-fit max-w-[75%] px-4 py-2 rounded-xl shadow ${
              msg.senderId === senderId
                ? "ml-auto bg-[#7C3AED] text-white rounded-br-none"
                : "mr-auto bg-white text-gray-900 rounded-bl-none"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-t">
        <input
          type="text"
          className="flex-1 bg-gray-100 rounded-full px-5 py-2 outline-none focus:ring-2 focus:ring-[#7C3AED]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-[#FACC15] hover:bg-yellow-400 text-black font-medium px-5 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
