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
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);