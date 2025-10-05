import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromDate: { type: String, required: true },
  fromTime: { type: String, required: true },
  toDate: { type: String, required: true },
  toTime: { type: String, required: true },
  noOfDays: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Leave", leaveSchema);
