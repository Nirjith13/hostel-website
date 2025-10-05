import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import roomRoutes from "./routes/room.js";
import foodRoutes from "./routes/food.js";
import orderRoutes from "./routes/order.js";
import leaveRoutes from "./routes/leave.js";
import complaintRoutes from "./routes/complaint.js";
import Leave from "./models/Leave.js";
import { autoAcceptComplaints } from "./auto-complaint-status.js";
// import { FoodItem } from "./models/Fooditem.js";
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // set exact domain in production
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes)
app.use("/api/room", roomRoutes)
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/complaint", complaintRoutes);

// Auto-accept pending leaves every 1 minute
setInterval(async () => {
  try {
    await Leave.updateMany(
      { status: "pending" },
      { $set: { status: "accepted" } }
    );
    // Optionally, log or handle the result
  } catch (err) {
    console.error("Error auto-accepting leaves:", err);
  }
}, 60 * 1000); // 1 minute

// Auto-accept pending complaints after 10 minutes
setInterval(autoAcceptComplaints, 60 * 1000); // check every 1 minute

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
