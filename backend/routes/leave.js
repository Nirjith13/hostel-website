import express from "express";
import Leave from "../models/Leave.js";
import auth from "../middleware/auth.js";
const router = express.Router();

// Post a new leave request
router.post("/", auth, async (req, res) => {
  try {
    const { fromDate, fromTime, toDate, toTime, noOfDays, reason } = req.body;
    const userId = req.user.id;
    const leave = await Leave.create({ userId, fromDate, fromTime, toDate, toTime, noOfDays, reason });
    res.json({ success: true, leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to post leave" });
  }
});

// Get all leave requests for the logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const leaves = await Leave.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch leaves" });
  }
});

export default router;
