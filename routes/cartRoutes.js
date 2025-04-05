const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middlewares/authMiddleware");

// Route to get a cart by user ID
router.get("/", authenticateUser, cartController.getCartByUserId);

// Route to create a new cart
router.post("/", authenticateUser, cartController.createCart);

// Route to add an item to the cart
router.post("/add", authenticateUser, cartController.addItemToCart);

// Route to remove an item from the cart
router.delete("/remove/:productId",authenticateUser, cartController.removeItemFromCart);

// Route to delete Cart
router.delete("/:cartId/",authenticateUser, cartController.deleteCart);

module.exports = router;
