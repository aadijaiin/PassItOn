import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import {Message} from "@/models/Message";

// GET: fetch messages between two users
export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  const messages = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).sort({ createdAt: 1 });

  return NextResponse.json({ messages }, { status: 200 });
}

/// POST: send a new message
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const body = await req.json();
    console.log("📥 Incoming message POST body:", body);

    const { senderId, receiverId, content, chatId } = body;

    if (!senderId || !receiverId || !content || !chatId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newMessage = await Message.create({
      chatId, // ✅ now we store the message under a chat
      senderId,
      receiverId,
      content,
    });

    console.log("✅ Message saved:", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("🔥 POST /api/messages error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
