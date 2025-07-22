"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatButton({ sellerId }: { sellerId: string }) {
  const [buyerId, setBuyerId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setBuyerId(data.userId);
      } catch (err) {
        console.error("Failed to fetch /me", err);
      }
    };
    fetchMe();
  }, []);

  const handleClick = async () => {
    if (!buyerId || !sellerId) return;

    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId, sellerId }),
      });

      const data = await res.json();
      router.push(`/chat/${data.chatId}`);
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#f97316]/90 text-lg font-bold text-white shadow hover:bg-[#ea580c] transition"
    >
      💬 Chat with Seller
    </button>
  );
}
