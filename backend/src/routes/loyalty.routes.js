const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const LoyaltyController = require("../controllers/loyalty.controller");

router.get("/points/balance", auth, LoyaltyController.getPointsBalance);
router.get("/points/history", auth, LoyaltyController.getPointsHistory);

module.exports = router;
