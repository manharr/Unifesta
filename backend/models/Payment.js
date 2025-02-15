import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
