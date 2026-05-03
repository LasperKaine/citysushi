const db = require("../config/db");

module.exports = {
  addTransaction: async (userId, pointsChange, description) => {
    const [result] = await db.execute(
      `INSERT INTO loyalty_transactions (user_id, points_change, description) VALUES (?, ?, ?)`,
      [userId, pointsChange, description],
    );
    return result.insertId;
  },

  getTransactionsByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM loyalty_transactions WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  getPointsBalance: async (userId) => {
    const [rows] = await db.execute(
      `SELECT COALESCE(SUM(points_change), 0) AS balance
       FROM loyalty_transactions WHERE user_id = ?`,
      [userId],
    );
    return rows[0].balance;
  },
};
