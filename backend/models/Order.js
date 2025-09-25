import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    deliveryName: { type: String, required: true }, // who to deliver to
    address: { type: String, required: true },      // delivery address
    status: {
      type: String,
      enum: ["pending", "assigned", "picked", "delivered"],
      default: "pending",
    },
    assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    deliveryDate: { type: Date, required: true }, // when delivery should happen
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
