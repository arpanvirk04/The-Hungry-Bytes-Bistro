const express = require("express");
const MenuItem = require("../models/menuItem");
const Order = require("../models/order");
const router = express.Router();

// Home Page
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.render("restaurant/home", { menuItems });
  } catch (error) {
    console.error("Error loading menu items:", error);
    res.status(500).send("Error loading menu items");
  }
});

// Place Order
router.post("/order", async (req, res) => {
  const { customerName, deliveryAddress, items } = req.body;

  if (!items) {
    return res.status(400).send("Error: No items selected");
  }

  try {
    const newOrder = new Order({
      customerName,
      deliveryAddress,
      items: Array.isArray(items) ? items : [items], // Ensure items is an array
      status: "RECEIVED",
    });

    const savedOrder = await newOrder.save();
    // Render the receipt page after placing the order
    res.render("restaurant/receipt", { order: savedOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Error placing order");
  }
});

// Check Order Status
router.post("/order-status", async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (order) {
      res.render("restaurant/status", { order });
    } else {
      res.render("restaurant/status", { error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).send("Error fetching order status");
  }
});

module.exports = router;
