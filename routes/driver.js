const express = require("express");
const bcrypt = require("bcryptjs");
const Driver = require("../models/driver");
const Order = require("../models/order");

const router = express.Router();

// Render Driver Registration Form
router.get("/register", (req, res) => {
  res.render("driver/register");
});

// Handle Driver Registration
router.post("/register", async (req, res) => {
  const { username, password, fullName, vehicleModel, vehicleColor, licensePlate } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDriver = new Driver({
      username,
      password: hashedPassword,
      fullName,
      vehicle: {
        model: vehicleModel,
        color: vehicleColor,
        licensePlate,
      },
    });

    await newDriver.save();
    res.redirect("/drivers/login"); // Redirect to login page after successful registration
  } catch (error) {
    console.error("Error registering driver:", error);
    res.status(500).send("Error registering driver");
  }
});

// Render Driver Login Form
router.get("/login", (req, res) => {
  res.render("driver/login");
});

// Handle Driver Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const driver = await Driver.findOne({ username });

    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      return res.status(401).send("Invalid credentials");
    }

    req.session.driverId = driver._id; // Save driver session
    res.redirect("/drivers/deliveries"); // Redirect to deliveries page
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in");
  }
});

// View Open Deliveries
router.get("/deliveries", async (req, res) => {
  if (!req.session.driverId) {
    return res.redirect("/drivers/login"); // Redirect to login if not authenticated
  }

  const deliveries = await Order.find({ status: "READY FOR DELIVERY" });
  res.render("driver/deliveries", { deliveries });
});

// Accept a Delivery
router.post("/deliveries/:id/accept", async (req, res) => {
  if (!req.session.driverId) {
    return res.redirect("/drivers/login");
  }

  await Order.findByIdAndUpdate(req.params.id, { status: "IN TRANSIT", driver: req.session.driverId });
  res.redirect("/drivers/deliveries");
});

// Mark Delivery as Completed
router.post("/deliveries/:id/deliver", async (req, res) => {
  if (!req.session.driverId) {
    return res.redirect("/drivers/login");
  }

  await Order.findByIdAndUpdate(req.params.id, { status: "DELIVERED" });
  res.redirect("/drivers/deliveries");
});

module.exports = router;
