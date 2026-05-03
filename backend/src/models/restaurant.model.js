const db = require("../config/db");

module.exports = {
  getInfo: async () => {
    const [rows] = await db.execute(`SELECT * FROM restaurant_info LIMIT 1`);
    return rows[0];
  },

  upsertInfo: async (openingHours, location, specialOffers) => {
    const existing = await module.exports.getInfo();
    if (existing) {
      await db.execute(
        `UPDATE restaurant_info SET opening_hours = ?, location = ?, special_offers = ? WHERE id = ?`,
        [openingHours, location, specialOffers, existing.id],
      );
    } else {
      await db.execute(
        `INSERT INTO restaurant_info (opening_hours, location, special_offers) VALUES (?, ?, ?)`,
        [openingHours, location, specialOffers],
      );
    }
  },
};
