const Rewards = require("../models/rewards.model");
const Loyalty = require("../models/loyalty.model");
const Coupon = require("../models/coupon.model");
const crypto = require("crypto");

module.exports = {
  //  USER
  getRewards: async (req, res) => {
    try {
      const rewards = await Rewards.getAllRewards();
      res.json({ rewards });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  redeemReward: async (req, res) => {
    try {
      const userId = req.user.id;
      const rewardId = req.params.id;

      const reward = await Rewards.getRewardById(rewardId);
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }

      const balance = await Loyalty.getPointsBalance(userId);
      if (balance < reward.point_cost) {
        return res.status(400).json({ message: "Not enough points" });
      }

      await Loyalty.addTransaction(
        userId,
        -reward.point_cost,
        `Redeemed reward: ${reward.name}`,
      );

      const couponCode = crypto.randomBytes(4).toString("hex").toUpperCase();

      const couponId = await Coupon.createCoupon(
        couponCode,
        reward.discount_value,
        null,
      );

      await Coupon.assignCouponToUser(userId, couponId);

      res.json({
        message: "Reward redeemed",
        couponCode,
        reward,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  //  ADMIN
  createReward: async (req, res) => {
    try {
      const rewardId = await Rewards.createReward(req.body);
      res.status(201).json({ message: "Reward created", rewardId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteReward: async (req, res) => {
    try {
      const deleted = await Rewards.deleteReward(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Reward not found" });
      }
      res.json({ message: "Reward deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
