import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    tech: String,
    progress: {
      type: Number,
      default: 0,
    },
     userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);