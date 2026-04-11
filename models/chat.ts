// models/Chat.ts
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: String,
    role: String, // "user" | "assistant"
    content: String,
  },
  { timestamps: true }
);

export default mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);