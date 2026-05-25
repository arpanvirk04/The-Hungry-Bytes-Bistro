const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  deliveryAddress: String,
  items: [String],
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["RECEIVED", "READY FOR DELIVERY", "IN TRANSIT", "DELIVERED"] },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
});

module.exports = mongoose.model("Order", orderSchema);
