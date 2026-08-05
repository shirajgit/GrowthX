import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // 🔥 MUST

    name: String,
    email: String,
    theme: {
      type: String,
      default: "dark",
    },

    // Privacy preferences (persisted from the Privacy & Data page)
    privacy: {
      analytics: { type: Boolean, default: true },
      ai_context: { type: Boolean, default: true },
      crash_reports: { type: Boolean, default: false },
      marketing: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);