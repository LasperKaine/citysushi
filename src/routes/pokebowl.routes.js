const express = require("express");
const router = express.Router();
const {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  updateAvailability,
} = require("../controllers/pokebowl.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// ADMIN ROUTES
router.post("/ingredients", auth, role("admin"), createIngredient);
router.put("/ingredients/:id", auth, role("admin"), updateIngredient);
router.delete("/ingredients/:id", auth, role("admin"), deleteIngredient);
router.patch("/ingredients/:id/availability", auth, role("admin"), updateAvailability);

// PUBLIC ROUTES
router.get("/ingredients", getIngredients);

module.exports = router;
