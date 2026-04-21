const db = require("../config/db");

module.exports = {
  getAllCategories: async () => {
    const [rows] = await db.execute(
      `SELECT * FROM menu_categories ORDER BY name`,
    );
    return rows;
  },

  getAllMenuItems: async () => {
    const [rows] = await db.execute(`
            SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.photo_url,
                m.availability,
                m.category_id,
                c.name AS category_name
            FROM menu_items m
            JOIN menu_categories c ON m.category_id = c.id
            ORDER BY m.category_id, m.name
        `);
    return rows;
  },

  getMenuItemById: async (id) => {
    const [rows] = await db.execute(
      `
            SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.photo_url,
                m.availability,
                m.category_id,
                c.name AS category_name
            FROM menu_items m
            JOIN menu_categories c ON m.category_id = c.id
            WHERE m.id = ?
            LIMIT 1
        `,
      [id],
    );
    return rows[0];
  },

  getIngredientsForItem: async (itemId) => {
    const [rows] = await db.execute(
      `
            SELECT i.id, i.name, i.type, i.price, i.allergen_info
            FROM ingredients i
            JOIN menu_item_ingredients mi ON mi.ingredient_id = i.id
            WHERE mi.item_id = ?
        `,
      [itemId],
    );
    return rows;
  },
};
