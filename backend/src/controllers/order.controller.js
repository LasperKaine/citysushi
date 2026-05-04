const Order = require("../models/order.model");
const Menu = require("../models/menu.model");
const crypto = require("crypto");

module.exports = {
  createOrder: async (req, res) => {
    const userId = req.user.id;
    const { items, deliveryMethod, addressId, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items" });
    }

    let connection;

    try {
      //start transaction
      connection = await Order.beginTransaction();

      let totalPrice = 0;

      //validate items and calculate total
      for (const item of items) {
        const { itemId, quantity, ingredients = [], specialRequest } = item;

        if (!itemId || quantity <= 0) {
          throw new Error("Invalid item or quantity");
        }

        //fetch menu item
        const menuItem = await Menu.getMenuItemById(itemId);
        if (!menuItem || !menuItem.availability) {
          throw new Error(`Menu item ${itemId} is unavailable`);
        }

        const itemPrice = menuItem.price;
        const itemTotal = itemPrice * quantity;
        totalPrice += itemTotal;

        //validate ingredients
        const validIngredients = await Menu.getIngredientsForItem(itemId);

        for (const ingredientId of ingredients) {
          const ingredient = validIngredients.find(
            (i) => i.id === ingredientId,
          );
          if (!ingredient) {
            throw new Error(
              `Invalid ingredient ${ingredientId} for item ${itemId}`,
            );
          }

          totalPrice += ingredient.price;
        }
      }

      //  generate order number
      const orderNumber = crypto.randomBytes(4).toString("hex").toUpperCase();

      const orderId = await Order.createOrder(
        connection,
        userId,
        orderNumber,
        deliveryMethod,
        addressId,
        totalPrice,
        notes,
      );

      for (const item of items) {
        const { itemId, quantity, ingredients = [], specialRequest } = item;

        const menuItem = await Menu.getMenuItemById(itemId);
        const itemPrice = menuItem.price;

        const orderItemId = await Order.addOrderItem(
          connection,
          orderId,
          itemId,
          quantity,
          itemPrice,
          specialRequest,
        );

        const validIngredients = await Menu.getIngredientsForItem(itemId);

        for (const ingredientId of ingredients) {
          const ingredient = validIngredients.find(
            (i) => i.id === ingredientId,
          );
          await Order.addOrderItemIngredient(
            connection,
            orderItemId,
            ingredientId,
            ingredient.price,
          );
        }
      }

      await Order.commit(connection);

      res.status(201).json({
        message: "Order created successfully",
        orderId,
        orderNumber,
        totalPrice,
      });
    } catch (err) {
      if (connection) await Order.rollback(connection);
      console.error(err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.getOrdersByUser(userId);
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await Order.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.user_id !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const items = await Order.getOrderItems(orderId);

      for (const item of items) {
        item.ingredients = await Order.getOrderItemIngredients(item.id);
      }

      res.json({ ...order, items });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.getAllOrders();
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const orderId = req.params.id;

      const allowed = [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updated = await Order.updateOrderStatus(orderId, status);

      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Status updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};
