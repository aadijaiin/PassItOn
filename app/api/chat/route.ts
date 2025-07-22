// /app/api/chat/route.ts (or pages/api/chat.ts if using pages)
import { connectToDatabase } from "@/lib/db";
import { Chat } from "@/models/Chat";

export async function POST(req: Request) {
  const { buyerId, sellerId, productId } = await req.json();
  await connectToDatabase();

  const existingChat = await Chat.findOne({
    participants: { $all: [buyerId, sellerId] },
    productId,
  });

  if (existingChat) {
    return Response.json({ chatId: existingChat._id });
  }

  const newChat = await Chat.create({
    participants: [buyerId, sellerId],
    productId,
  });

  return Response.json({ chatId: newChat._id });
}
