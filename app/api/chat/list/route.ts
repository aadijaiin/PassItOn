import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/models/Chat";
import {Message} from "@/models/Message"; // assuming you have a model for messages

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();Message

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;
    console.log("🟡 /api/chat/list userId:", userId);
    // Step 1: Get all chats where user is a participant
    const chats = await Chat.find({ participants: userId }).sort({ updatedAt: -1 }).lean();

    // Step 2: Fetch last message per chat
    const chatsWithLastMessage = await Promise.all(
      chats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chatId: chat._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...chat,
          lastMessage: lastMessage?.content || null,
          lastMessageTime: lastMessage?.createdAt || chat.updatedAt,
        };
      })
    );

    return NextResponse.json(chatsWithLastMessage);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
