const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authenticateUser = require("../middlewares/authMiddleware");

// Route to get a cart by user ID
router.get("/", authenticateUser , cartController.getCartByUserId);

// Route to create a new cart
router.post("/", authenticateUser, cartController.createCart);

// Route to add an item to the cart
//router.post("/add", cartController.addItemToCart);

// Route to remove an item from the cart
//router.delete("/remove/:cartId/:productId", cartController.removeItemFromCart);

module.exports = router;
