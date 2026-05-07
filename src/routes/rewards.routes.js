const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const RewardsController = require("../controllers/rewards.controller");

//  ADMIN — REWARDS
router.post("/admin/rewards", auth, role("admin"), RewardsController.createReward);
router.put("/admin/rewards/:id", auth, role("admin"), RewardsController.updateReward);
router.delete("/admin/rewards/:id", auth, role("admin"), RewardsController.deleteReward);

//  ADMIN — COUPONS
router.get("/admin/coupons", auth, role("admin"), RewardsController.getAllCoupons);
router.post("/admin/coupons", auth, role("admin"), RewardsController.createCoupon);
router.delete("/admin/coupons/:id", auth, role("admin"), RewardsController.deleteCoupon);

//  USER
router.get("/", auth, RewardsController.getRewards);
router.post("/:id/redeem", auth, RewardsController.redeemReward);

module.exports = router;
