import express from "express";
import { FoodItem } from "../models/Fooditem.js";
import Order from "../models/Order.js";
import QRCode from "qrcode";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
const router = express.Router();

router.get("/daily-menu", async (req, res) => {
  try {
    const items = await FoodItem.find();
    const menuItems = items.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
      defaultMeal: item.defaultMeal,
      dailyStock: item.dailyStock,
    }));
    res.json({ success: true, items: menuItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await FoodItem.find({});
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

router.post("/buy", auth, async (req, res) => {
  try {
    const { itemId, meal, date, amount, count = 1 } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const totalAmount = amount * count;
    if (user.financial.balance < totalAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    user.financial.balance -= totalAmount;
    await user.save();
    const item = await FoodItem.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.dailyStock < count) {
      return res.status(400).json({ error: "Not enough stock available" });
    }



  // generate QR code as plain text with | delimiter for compatibility
  const qrText = `User: ${userId}|Item: ${itemId}|Meal: ${meal}|Date: ${date}|Count: ${count}`;
  const qrCodeData = await QRCode.toDataURL(qrText);

    const order = await Order.create({
      item: item._id,
      userId,
      meal,
      date,
      amount: totalAmount,
      count,
      qrCode: qrCodeData,
      qrText, // Optionally store the plain text for reference
    });

    item.dailyStock -= count;
    await item.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});


// QR code verification endpoint
router.post("/verify-qr", async (req, res) => {
  try {
    const { qrString } = req.body;
    if (!qrString) return res.status(400).json({ error: "QR string required" });

    // Example QR string: user:USERID|item:ITEMID|meal:MEAL|date:DATE|count:COUNT
    const parts = qrString.split("|").reduce((acc, part) => {
      const [key, value] = part.split(":");
      acc[key] = value;
      return acc;
    }, {});

    const { user: userId, item: itemId, meal, date, count } = parts;
    if (!userId || !itemId || !meal || !date) {
      return res.status(400).json({ error: "Invalid QR data" });
    }

    // Find order with these details
    const order = await Order.findOne({
      userId,
      item: itemId,
      meal,
      date,
      ...(count ? { count: Number(count) } : {})
    });

    if (!order) {
      return res.status(404).json({ valid: false, message: "Order not found or already used" });
    }

    // Optionally: mark as used, or add more checks here

    res.json({ valid: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify QR code" });
  }
});

export default router;
