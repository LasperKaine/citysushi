const express = require("express");
const router = express.Router();
const {
  getCategories,
  getMenu,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateAvailability,
} = require("../controllers/menu.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

//  ADMIN ROUTES
router.post("/", auth, role("admin"), createMenuItem);
router.put("/:id", auth, role("admin"), updateMenuItem);
router.delete("/:id", auth, role("admin"), deleteMenuItem);
router.patch("/:id/availability", auth, role("admin"), updateAvailability);

//  PUBLIC ROUTES
router.get("/categories", getCategories);
router.get("/", getMenu);
router.get("/:id", getMenuItem);

module.exports = router;
