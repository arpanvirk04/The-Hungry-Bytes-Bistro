const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  username: String,
  password: String,
  fullName: String,
  vehicle: {
    model: String,
    color: String,
    licensePlate: String,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
