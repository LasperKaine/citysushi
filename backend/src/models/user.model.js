const db = require("../config/db");

module.exports = {
  createUser: async (name, email, phone, passwordHash, role = "customer") => {
    const [result] = await db.execute(
      `INSERT INTO users (name, email, phone, password_hash, role)
             VALUES (?,?,?,?,?)`,
      [name, email, phone, passwordHash, role],
    );
    return result.insertId;
  },

  findUserByEmail: async (email) => {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email],
    );
    return rows[0];
  },

  findUserById: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0];
  },
};
