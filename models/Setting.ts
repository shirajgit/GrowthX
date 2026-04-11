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
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);