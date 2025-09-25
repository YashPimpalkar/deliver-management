import mongoose from "mongoose";

const userLocationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default mongoose.model("UserLocation", userLocationSchema);
