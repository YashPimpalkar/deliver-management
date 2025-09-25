import mongoose from "mongoose";

const orderLocationSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    pickup: {
      latitude: Number,
      longitude: Number,
      time: Date,
    },

    delivery: {
      latitude: Number,
      longitude: Number,
      time: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderLocation", orderLocationSchema);
