import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    theme: {
      type: String,
      default: "dark",
    },
     userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Setting ||
  mongoose.model("Setting", SettingSchema);