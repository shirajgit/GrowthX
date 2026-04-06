import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
     userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Note ||
  mongoose.model("Note", NoteSchema); 