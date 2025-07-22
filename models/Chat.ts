// models/Chat.ts
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: String, required: true }], // user IDs (just strings)
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
