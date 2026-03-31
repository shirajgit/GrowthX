import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    email: String,
    status: {
      type: String,
      enum: ["active", "pending", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Client ||
  mongoose.model("Client", ClientSchema);