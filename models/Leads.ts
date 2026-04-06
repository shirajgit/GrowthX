 import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    company: String,
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
    },
    work: String, 

    // 🔥 IMPORTANT
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);