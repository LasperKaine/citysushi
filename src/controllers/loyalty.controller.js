const Loyalty = require("../models/loyalty.model");

module.exports = {
  getPointsBalance: async (req, res) => {
    try {
      const userId = req.user.id;
      const balance = await Loyalty.getPointsBalance(userId);
      res.json({ balance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getPointsHistory: async (req, res) => {
    try {
      const userId = req.user.id;
      const history = await Loyalty.getTransactionsByUser(userId);
      res.json({ history });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
