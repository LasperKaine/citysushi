const db = require("../config/db");

module.exports = {
  getAllRewards: async () => {
    const [rows] = await db.execute(
      `SELECT * FROM rewards ORDER BY point_cost ASC`,
    );
    return rows;
  },

  getRewardById: async (id) => {
    const [rows] = await db.execute(`SELECT * FROM rewards WHERE id = ?`, [id]);
    return rows[0];
  },

  createReward: async (data) => {
    const {
      name,
      description,
      type,
      point_cost,
      menu_item_id,
      discount_value,
    } = data;
    const [result] = await db.execute(
      `INSERT INTO rewards (name, description, type, point_cost, menu_item_id, discount_value)
             VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, type, point_cost, menu_item_id, discount_value],
    );
    return result.insertId;
  },

  deleteReward: async (id) => {
    const [result] = await db.execute(`DELETE FROM rewards WHERE id = ?`, [id]);
    return result.affectedRows;
  },
};
