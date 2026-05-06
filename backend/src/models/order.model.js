const db = require("../config/db");

module.exports = {
  //  TRANSACTION CONTROL
  beginTransaction: async () => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
    return connection;
  },

  commit: async (connection) => {
    await connection.commit();
    connection.release();
  },

  rollback: async (connection) => {
    await connection.rollback();
    connection.release();
  },

  //  ORDER CREATION
  createOrder: async (
    connection,
    userId,
    orderNumber,
    deliveryMethod,
    addressId = null,
    totalPrice,
    notes,
    couponId = null,
  ) => {
    const [result] = await connection.execute(
      `INSERT INTO orders 
       (user_id, order_number, delivery_method, address_id, total_price, notes, coupon_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        orderNumber,
        deliveryMethod,
        addressId,
        totalPrice,
        notes || null,
        couponId || null,
      ],
    );
    return result.insertId;
  },

  addOrderItem: async (
    connection,
    orderId,
    itemId,
    quantity,
    priceSnapshot,
    specialRequest,
  ) => {
    const [result] = await connection.execute(
      `INSERT INTO order_items (order_id, item_id, quantity, price_snapshot, special_request)
       VALUES (?, ?, ?, ?,?)`,
      [orderId, itemId, quantity, priceSnapshot, specialRequest || null],
    );
    return result.insertId;
  },

  addOrderItemIngredient: async (
    connection,
    orderItemId,
    ingredientId,
    priceSnapshot,
  ) => {
    await connection.execute(
      `INSERT IGNORE INTO order_item_ingredients (order_item_id, ingredient_id, price_snapshot) 
       VALUES (?, ?, ?)`,
      [orderItemId, ingredientId, priceSnapshot],
    );
  },

  //  ORDER RETRIEVAL
  getOrderById: async (orderId) => {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE id = ? LIMIT 1`,
      [orderId],
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

  //  USER & ADMIN QUERIES
  getOrdersByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
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
