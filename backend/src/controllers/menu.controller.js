const Menu = require("../models/menu.model");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await Menu.getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getMenu: async (req, res) => {
    try {
      const items = await Menu.getAllMenuItems();
      res.json(items);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getMenuItem: async (req, res) => {
    try {
      const id = req.params.id;
      const item = await Menu.getItemById(id);

      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      const ingredients = await Menu.getIngredientsForItem(id);

      res.json({
        ...item,
        ingredients,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
