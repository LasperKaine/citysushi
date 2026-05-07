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
                m.allergens,
                m.category_id,
                c.name AS category_name
            FROM menu_items m
            JOIN menu_categories c ON m.category_id = c.id
            ORDER BY m.category_id, m.name
        `);
    return rows;
  },

  getFilteredMenuItems: async ({ categoryId, excludeAllergens, available, search } = {}) => {
    const conditions = [];
    const params = [];

    if (categoryId != null) {
      conditions.push("m.category_id = ?");
      params.push(categoryId);
    }

    if (available != null) {
      conditions.push("m.availability = ?");
      params.push(available);
    }

    if (search) {
      conditions.push("(m.name LIKE ? OR m.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (excludeAllergens && excludeAllergens.length > 0) {
      for (const allergen of excludeAllergens) {
        conditions.push("(m.allergens IS NULL OR m.allergens NOT LIKE ?)");
        params.push(`%${allergen}%`);
      }
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.execute(
      `SELECT
          m.id,
          m.name,
          m.description,
          m.price,
          m.photo_url,
          m.availability,
          m.allergens,
          m.category_id,
          c.name AS category_name
       FROM menu_items m
       JOIN menu_categories c ON m.category_id = c.id
       ${where}
       ORDER BY m.category_id, m.name`,
      params,
    );
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
                m.allergens,
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

  createMenuItem: async (categoryId, name, description, price, photoUrl, allergens) => {
    const [result] = await db.execute(
      `INSERT INTO menu_items (category_id, name, description, price, photo_url, allergens)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [categoryId, name, description || null, price, photoUrl || null, allergens || null],
    );
    return result.insertId;
  },

  updateMenuItem: async (id, categoryId, name, description, price, photoUrl, allergens) => {
    const [result] = await db.execute(
      `UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, photo_url = ?, allergens = ?
       WHERE id = ?`,
      [categoryId, name, description || null, price, photoUrl || null, allergens || null, id],
    );
    return result.affectedRows;
  },

  deleteMenuItem: async (id) => {
    const [result] = await db.execute(
      `DELETE FROM menu_items WHERE id = ?`,
      [id],
    );
    return result.affectedRows;
  },

  updateAvailability: async (id, availability) => {
    const [result] = await db.execute(
      `UPDATE menu_items SET availability = ? WHERE id = ?`,
      [availability, id],
    );
    return result.affectedRows;
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
