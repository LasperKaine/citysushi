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

  createMenuItem: async (req, res) => {
    try {
      const { categoryId, name, description, price, photoUrl, allergens } = req.body;

      if (!categoryId || !name || price == null) {
        return res.status(400).json({ message: "categoryId, name, and price are required" });
      }

      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ message: "price must be a non-negative number" });
      }

      const id = await Menu.createMenuItem(categoryId, name, description, price, photoUrl, allergens);
      const item = await Menu.getMenuItemById(id);
      res.status(201).json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateMenuItem: async (req, res) => {
    try {
      const id = req.params.id;
      const { categoryId, name, description, price, photoUrl, allergens } = req.body;

      if (!categoryId || !name || price == null) {
        return res.status(400).json({ message: "categoryId, name, and price are required" });
      }

      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ message: "price must be a non-negative number" });
      }

      const item = await Menu.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      await Menu.updateMenuItem(id, categoryId, name, description, price, photoUrl, allergens);
      const updated = await Menu.getMenuItemById(id);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteMenuItem: async (req, res) => {
    try {
      const id = req.params.id;

      const item = await Menu.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      await Menu.deleteMenuItem(id);
      res.json({ message: "Menu item deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateAvailability: async (req, res) => {
    try {
      const id = req.params.id;
      const { availability } = req.body;

      if (typeof availability !== "boolean") {
        return res.status(400).json({ message: "availability must be a boolean" });
      }

      const item = await Menu.getMenuItemById(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      await Menu.updateAvailability(id, availability);
      res.json({ message: "Availability updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getMenuItem: async (req, res) => {
    try {
      const id = req.params.id;
      const item = await Menu.getMenuItemById(id);

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
