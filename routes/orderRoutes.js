const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateUser = require("../middlewares/authMiddleware");
// Route to get orders by user ID
router.get("/", authenticateUser, orderController.getOrdersByUserId);

// Route to create a new order
router.post("/", authenticateUser , orderController.createOrder);

// Route to add items to the order
//router.post("/add", orderController.addItemsToOrder);

// Route to remove an item from the order
// router.delete("/remove/:orderId/:productId",orderController.removeItemFromOrder
// );

module.exports = router;
