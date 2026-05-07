const Rewards = require("../models/rewards.model");
const Loyalty = require("../models/loyalty.model");
const Coupon = require("../models/coupon.model");
const crypto = require("crypto");

const VALID_REWARD_TYPES = ["FREE_ITEM", "DISCOUNT_PERCENT", "DISCOUNT_AMOUNT"];

function validateRewardBody(body) {
  const { name, type, point_cost } = body;
  if (!name || !type || point_cost == null) {
    return "name, type, and point_cost are required";
  }
  if (!VALID_REWARD_TYPES.includes(type)) {
    return `type must be one of: ${VALID_REWARD_TYPES.join(", ")}`;
  }
  if (!Number.isInteger(point_cost) || point_cost <= 0) {
    return "point_cost must be a positive integer";
  }
  if (type === "FREE_ITEM" && !body.menu_item_id) {
    return "menu_item_id is required for FREE_ITEM rewards";
  }
  if (type !== "FREE_ITEM" && body.discount_value == null) {
    return "discount_value is required for DISCOUNT_PERCENT and DISCOUNT_AMOUNT rewards";
  }
  return null;
}

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

      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 30);
      const expirationDate = expiration.toISOString().split("T")[0];

      const couponId = await Coupon.createCoupon(
        couponCode,
        reward.discount_value,
        expirationDate,
      );

      await Coupon.assignCouponToUser(userId, couponId);

      res.json({ message: "Reward redeemed", couponCode, reward });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  //  ADMIN — REWARDS
  createReward: async (req, res) => {
    try {
      const error = validateRewardBody(req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const rewardId = await Rewards.createReward(req.body);
      const reward = await Rewards.getRewardById(rewardId);
      res.status(201).json(reward);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateReward: async (req, res) => {
    try {
      const id = req.params.id;

      const existing = await Rewards.getRewardById(id);
      if (!existing) {
        return res.status(404).json({ message: "Reward not found" });
      }

      const error = validateRewardBody(req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      await Rewards.updateReward(id, req.body);
      const updated = await Rewards.getRewardById(id);
      res.json(updated);
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

  //  ADMIN — COUPONS
  getAllCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.getAllCoupons();
      res.json(coupons);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  createCoupon: async (req, res) => {
    try {
      const { code, discountValue, expirationDate } = req.body;

      if (!code || discountValue == null || !expirationDate) {
        return res.status(400).json({ message: "code, discountValue, and expirationDate are required" });
      }

      if (typeof discountValue !== "number" || discountValue <= 0) {
        return res.status(400).json({ message: "discountValue must be a positive number" });
      }

      const existing = await Coupon.getCouponByCode(code);
      if (existing) {
        return res.status(409).json({ message: "Coupon code already exists" });
      }

      const id = await Coupon.createCoupon(code, discountValue, expirationDate);
      const coupon = await Coupon.getCouponById(id);
      res.status(201).json(coupon);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteCoupon: async (req, res) => {
    try {
      const deleted = await Coupon.deleteCoupon(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      res.json({ message: "Coupon deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
