import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: String,
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
    },
    work: String, // 🔥 what action to take (follow-up, call, proposal)
  },
  { timestamps: true }
);

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);