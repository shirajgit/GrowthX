import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    email: String,
    image: String,

    theme: {
      type: String,
      default: "dark",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);