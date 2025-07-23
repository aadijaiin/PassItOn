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

  // Polling every 3s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?user1=${senderId}&user2=${receiverId}`);
        if (!res.ok) {
          console.error("Polling failed:", await res.text());
          return;
        }

        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [senderId, receiverId]);

  // Scroll to bottom on new message
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
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <div
        ref={containerRef}
        className="chat-container border p-4 rounded bg-gray-100 space-y-2 max-h-[60vh] overflow-y-auto"
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-2 rounded-md max-w-[75%] ${
              msg.senderId === senderId
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-300 text-black mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
