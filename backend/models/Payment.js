import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, default: "SWIFT" },
  payeeAccount: { type: String, required: true },
  swiftCode: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Verified"], default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
