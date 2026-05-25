const express = require("express");
const Order = require("../models/order");
const Driver = require("../models/driver");
const router = express.Router();

// View All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("driver").sort({ date: -1 });
    const drivers = await Driver.find();
    res.render("orders/list", { orders, drivers });
  } catch (error) {
    console.error("Error loading orders:", error);
    res.status(500).send("Error loading orders");
  }
});

// Update Order Status
router.post("/:id/update", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await Order.findByIdAndUpdate(id, { status });
    res.redirect("/orders");
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send("Error updating order status");
  }
});

// Assign Driver to Order
router.post("/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { driverId } = req.body;

  try {
    await Order.findByIdAndUpdate(id, { driver: driverId });
    res.redirect("/orders");
  } catch (error) {
    console.error("Error assigning driver:", error);
    res.status(500).send("Error assigning driver");
  }
});

module.exports = router;
