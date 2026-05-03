const db = require("../config/db");

module.exports = {
  createOrder: async (userId, orderNumber, deliveryMethod, addressId = null) => {
    const [result] = await db.execute(
      `INSERT INTO orders (user_id, order_number, delivery_method, address_id) VALUES (?, ?, ?, ?)`,
      [userId, orderNumber, deliveryMethod, addressId],
    );
    return result.insertId;
  },

  addOrderItem: async (orderId, itemId, quantity, specialRequest = null) => {
    const [result] = await db.execute(
      `INSERT INTO order_items (order_id, item_id, quantity, special_request) VALUES (?, ?, ?, ?)`,
      [orderId, itemId, quantity, specialRequest],
    );
    return result.insertId;
  },

  addOrderItemIngredient: async (orderItemId, ingredientId) => {
    await db.execute(
      `INSERT IGNORE INTO order_item_ingredients (order_item_id, ingredient_id) VALUES (?, ?)`,
      [orderItemId, ingredientId],
    );
  },

  getOrdersByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  getOrderById: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0];
  },

  getOrderItems: async (orderId) => {
    const [rows] = await db.execute(
      `SELECT oi.*, m.name AS item_name, m.price
       FROM order_items oi
       JOIN menu_items m ON oi.item_id = m.id
       WHERE oi.order_id = ?`,
      [orderId],
    );
    return rows;
  },

  getOrderItemIngredients: async (orderItemId) => {
    const [rows] = await db.execute(
      `SELECT i.* FROM ingredients i
       JOIN order_item_ingredients oii ON oii.ingredient_id = i.id
       WHERE oii.order_item_id = ?`,
      [orderItemId],
    );
    return rows;
  },

  updateOrderStatus: async (id, status) => {
    const [result] = await db.execute(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id],
    );
    return result.affectedRows;
  },

  getAllOrders: async () => {
    const [rows] = await db.execute(
      `SELECT o.*, u.name AS user_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`,
    );
    return rows;
  },
};
