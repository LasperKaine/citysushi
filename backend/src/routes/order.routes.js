const express = require("express");
const router = express.Router();

const OrderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

//  ADMIN ROUTES

router.get("/admin/all", auth, role("admin"), OrderController.getAllOrders);

router.patch("/admin/:id/status", auth, role("admin"), OrderController.updateOrderStatus,);

//   USER ROUTES

//  create a new order
router.post("/", auth, OrderController.createOrder);

//  get all orders for logged in user
router.get("/", auth, OrderController.getUserOrders);

//  get a single order
router.get("/:id", auth, OrderController.getOrderById);

module.exports = router;
