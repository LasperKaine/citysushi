const Pokebowl = require("../models/pokebowl.model");

const VALID_CATEGORIES = ["base", "protein", "topping", "sauce", "extra"];

module.exports = {
  getIngredients: async (req, res) => {
    try {
      const { category } = req.query;
      if (category && !VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      const ingredients = await Pokebowl.getAllIngredients(category || null);
      res.json(ingredients);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  createIngredient: async (req, res) => {
    try {
      const { name, category, price, allergenInfo } = req.body;
      if (!name || !category || price == null) {
        return res.status(400).json({ message: "name, category and price are required" });
      }
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      if (price < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }
      const id = await Pokebowl.createIngredient(name, category, price, allergenInfo);
      res.status(201).json({ message: "Ingredient created", id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateIngredient: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, price, allergenInfo } = req.body;
      if (!name || !category || price == null) {
        return res.status(400).json({ message: "name, category and price are required" });
      }
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      if (price < 0) {
        return res.status(400).json({ message: "Price cannot be negative" });
      }
      const affected = await Pokebowl.updateIngredient(id, name, category, price, allergenInfo);
      if (!affected) return res.status(404).json({ message: "Ingredient not found" });
      res.json({ message: "Ingredient updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteIngredient: async (req, res) => {
    try {
      const { id } = req.params;
      const affected = await Pokebowl.deleteIngredient(id);
      if (!affected) return res.status(404).json({ message: "Ingredient not found" });
      res.json({ message: "Ingredient deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateAvailability: async (req, res) => {
    try {
      const { id } = req.params;
      const { available } = req.body;
      if (available == null) {
        return res.status(400).json({ message: "available field is required" });
      }
      const affected = await Pokebowl.updateAvailability(id, available);
      if (!affected) return res.status(404).json({ message: "Ingredient not found" });
      res.json({ message: "Availability updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
