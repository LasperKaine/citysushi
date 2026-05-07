const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const loyaltyRoutes = require("./routes/loyalty.routes");
const rewardRoutes = require("./routes/rewards.routes");

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/rewards", rewardRoutes);

module.exports = app;
