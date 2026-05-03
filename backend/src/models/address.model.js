const db = require("../config/db");

module.exports = {
  createAddress: async (userId, street, city, postalCode) => {
    const [result] = await db.execute(
      `INSERT INTO addresses (user_id, street, city, postal_code) VALUES (?, ?, ?, ?)`,
      [userId, street, city, postalCode],
    );
    return result.insertId;
  },

  getAddressesByUser: async (userId) => {
    const [rows] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ?`,
      [userId],
    );
    return rows;
  },

  getAddressById: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM addresses WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0];
  },

  updateAddress: async (id, street, city, postalCode) => {
    const [result] = await db.execute(
      `UPDATE addresses SET street = ?, city = ?, postal_code = ? WHERE id = ?`,
      [street, city, postalCode, id],
    );
    return result.affectedRows;
  },

  deleteAddress: async (id) => {
    const [result] = await db.execute(`DELETE FROM addresses WHERE id = ?`, [id]);
    return result.affectedRows;
  },
};
