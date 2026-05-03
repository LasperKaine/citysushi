const express = require("express");
const cors = require("cors");
const menuRoutes = require("./routes/menu.routes");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

module.exports = app;
