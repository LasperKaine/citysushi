const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const RewardsController = require("../controllers/rewards.controller");

//  USER
router.get("/", auth, RewardsController.getRewards);
router.post("/:id/redeem", auth, RewardsController.redeemReward);

//ADMIN
router.post("/admin", auth, role("admin"), RewardsController.createReward);
router.delete(
  "/admin/:id",
  auth,
  role("admin"),
  RewardsController.deleteReward,
);

module.exports = router;
