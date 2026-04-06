import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "offer"],
      default: "applied",
    },

    // 🔥 IMPORTANT
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);