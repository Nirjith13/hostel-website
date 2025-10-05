import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true }, // e.g., Plumbing, Electrical, Cleaning
  description: { type: String, required: true },
  status: { type: String, enum: ["pending", "in progress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Complaint", complaintSchema);
