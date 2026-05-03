const db = require("../config/db");

module.exports = {
  createCoupon: async (code, discountValue, expirationDate) => {
    const [result] = await db.execute(
      `INSERT INTO coupons (code, discount_value, expiration_date) VALUES (?, ?, ?)`,
      [code, discountValue, expirationDate],
    );
    return result.insertId;
  },

  getCouponByCode: async (code) => {
    const [rows] = await db.execute(
      `SELECT * FROM coupons WHERE code = ? LIMIT 1`,
      [code],
    );
    return rows[0];
  },

  assignCouponToUser: async (userId, couponId) => {
    await db.execute(
      `INSERT IGNORE INTO user_coupons (user_id, coupon_id) VALUES (?, ?)`,
      [userId, couponId],
    );
  },

  getCouponsByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT c.*, uc.used_at
       FROM coupons c
       JOIN user_coupons uc ON uc.coupon_id = c.id
       WHERE uc.user_id = ?`,
      [userId],
    );
    return rows;
  },

  markCouponUsed: async (userId, couponId) => {
    const [result] = await db.execute(
      `UPDATE user_coupons SET used_at = NOW() WHERE user_id = ? AND coupon_id = ? AND used_at IS NULL`,
      [userId, couponId],
    );
    return result.affectedRows;
  },
};
