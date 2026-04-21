const express = require("express");
const router = express.Router();
const {
  getCategories,
  getMenu,
  getMenuItem,
} = require("../controllers/menu.controller");

router.get("/categories", getCategories);
router.get("/", getMenu);
router.get("/:id", getMenuItem);

module.exports = router;
