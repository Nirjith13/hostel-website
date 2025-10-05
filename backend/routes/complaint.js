import express from "express";
import Complaint from "../models/Complaint.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Submit a new complaint
router.post("/", auth, async (req, res) => {
  try {
    const { type, description } = req.body;
    const userId = req.user.id;
    const complaint = await Complaint.create({ userId, type, description });
    res.json({ success: true, complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to submit complaint" });
  }
});

// Get all complaints for the logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch complaints" });
  }
});

// (Optional) Update complaint status (for future admin use)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

export default router;
