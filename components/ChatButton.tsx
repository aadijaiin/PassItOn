"use client";

import { useRouter } from "next/navigation";

export default function ChatButton({ sellerId }: { sellerId: string }) {
  const router = useRouter();

  const handleClick = async () => {
  try {
    console.log("🟡 Attempting to fetch /api/auth/me");

    const meRes = await fetch("/api/auth/me", {
      credentials: "include", // IMPORTANT
    });

    console.log("🟢 /api/auth/me status:", meRes.status);

    if (!meRes.ok) {
      const errText = await meRes.text();
      console.error("🔴 Failed /api/auth/me response text:", errText);
      throw new Error("Failed to fetch logged-in user");
    }

    const meData = await meRes.json();
    console.log("🟢 meData received:", meData);

    const buyerId = meData.user?.userId;
    if (!buyerId || !sellerId) {
      console.error("🔴 Missing buyerId or sellerId:", { buyerId, sellerId });
      return;
    }

    console.log("🟡 Creating or getting chat with:", { buyerId, sellerId });

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, sellerId }),
    });

    console.log("🟢 /api/chat status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error("🔴 Failed to start chat:", errText);
      throw new Error("Failed to start chat");
    }

    const data = await res.json();
    console.log("✅ Chat data received:", data);

    router.push(`/chat/${data.chatId}`);
  } catch (err) {
    console.error("🔴 Chat button error:", err);
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
