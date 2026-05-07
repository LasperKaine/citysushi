const db = require("../config/db");

module.exports = {
  createLog: async (userId, action) => {
    const [result] = await db.execute(
      `INSERT INTO system_logs (user_id, action) VALUES (?, ?)`,
      [userId ?? null, action],
    );
    return result.insertId;
  },

  getLogs: async () => {
    const [rows] = await db.execute(
      `SELECT l.*, u.email
       FROM system_logs l
       LEFT JOIN users u ON l.user_id = u.id
       ORDER BY l.created_at DESC`,
    );
    return rows;
  },

  getLogsByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM system_logs WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },
};
