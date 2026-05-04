const db = require("../config/db");

module.exports = {
  getAllrewards: async () => {
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
      `INSERT INTO rewards (name, description, type, point_cost, menu_item_id, discount_value
             VALUEs (?, ?, ?, ?, ?, ?)`,
      [name, description, type, point_cost, menu_item_id, discount_value],
    );
  },

  deleteReward: async (id) => {
    const [result] = await db.execute(`DELETE FROM rewards WHERE id = ?`, [id]);
    return result.affectedRows;
  },
};
