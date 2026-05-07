const db = require("../config/db");

module.exports = {
  getAllIngredients: async (category = null) => {
    if (category) {
      const [rows] = await db.execute(
        `SELECT * FROM pokebowl_ingredients WHERE category = ? ORDER BY name`,
        [category],
      );
      return rows;
    }
    const [rows] = await db.execute(
      `SELECT * FROM pokebowl_ingredients ORDER BY category, name`,
    );
    return rows;
  },

  getIngredientById: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM pokebowl_ingredients WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0];
  },

  getIngredientsByIds: async (ids) => {
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => "?").join(", ");
    const [rows] = await db.execute(
      `SELECT * FROM pokebowl_ingredients WHERE id IN (${placeholders}) AND available = TRUE`,
      ids,
    );
    return rows;
  },

  createIngredient: async (name, category, price, allergenInfo) => {
    const [result] = await db.execute(
      `INSERT INTO pokebowl_ingredients (name, category, price, allergen_info)
       VALUES (?, ?, ?, ?)`,
      [name, category, price, allergenInfo || null],
    );
    return result.insertId;
  },

  updateIngredient: async (id, name, category, price, allergenInfo) => {
    const [result] = await db.execute(
      `UPDATE pokebowl_ingredients SET name = ?, category = ?, price = ?, allergen_info = ?
       WHERE id = ?`,
      [name, category, price, allergenInfo || null, id],
    );
    return result.affectedRows;
  },

  deleteIngredient: async (id) => {
    const [result] = await db.execute(
      `DELETE FROM pokebowl_ingredients WHERE id = ?`,
      [id],
    );
    return result.affectedRows;
  },

  updateAvailability: async (id, available) => {
    const [result] = await db.execute(
      `UPDATE pokebowl_ingredients SET available = ? WHERE id = ?`,
      [available, id],
    );
    return result.affectedRows;
  },
};
