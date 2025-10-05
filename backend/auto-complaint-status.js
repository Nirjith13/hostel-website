import Complaint from "./models/Complaint.js";

export async function autoAcceptComplaints() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  try {
    await Complaint.updateMany(
      { status: "pending", createdAt: { $lte: tenMinutesAgo } },
      { $set: { status: "accepted" } }
    );
  } catch (err) {
    console.error("Error auto-accepting complaints:", err);
  }
}
