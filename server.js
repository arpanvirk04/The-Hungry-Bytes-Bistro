const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const MenuItem = require("./models/menuItem"); 
const app = express();
const restaurantRoutes = require("./routes/restaurant");


// Constants
const PORT = 8000;
//const CONNECTION_STRING = `mongodb+srv://dbUser:loonakimlip@cluster0.3eb3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const CONNECTION_STRING = `mongodb+srv://dbUser:Arpanvirk04@cluster0.s5vvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB Connection
mongoose
  .connect(CONNECTION_STRING)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Add sample menu items if the collection is empty
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany([
        { name: "Burger", description: "Juicy grilled burger", price: 10, image: "/images/burger.jpg" },
        { name: "Pizza", description: "Cheesy pepperoni pizza", price: 12, image: "/images/pizza.jpg" },
        { name: "Pasta", description: "Creamy Alfredo pasta", price: 15, image: "/images/pasta.jpg" },
        { name: "Salad", description: "Fresh garden salad", price: 8, image: "/images/salad.jpg" },
      ]);
      console.log("Sample menu items added to the database.");
    }
  })
  .catch((error) => console.error("Could not connect to MongoDB:", error));

// Routes
app.use("/", require("./routes/restaurant"));
app.use("/orders", require("./routes/orders"));
app.use("/drivers", require("./routes/driver"));
app.use("/", restaurantRoutes);


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
