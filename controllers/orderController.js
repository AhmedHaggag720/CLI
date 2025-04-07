const { check } = require("express-validator");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
require('dotenv').config();

// Get Orders by User ID
async function getOrdersByUserId(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.getOrdersByUserId(userId);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Create a new Order
async function createOrder(req, res) {
  try {
    const userId = req.user.id;
    const { total } = req.body;

    const order = await Order.createOrder(userId, total);
    return res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Add items to the order
async function addItemsToOrder(req, res) {
  try {
    const { orderId, productId, quantity } = req.body;

    const addedItem = await Order.addItemsToOrder(orderId, productId, quantity);
    return res.status(201).json({ success: true, item: addedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Remove an item from the order
async function removeItemFromOrder(req, res) {
  try {
    const { orderId, productId } = req.params;

    const removedItem = await Order.removeItemFromOrder(orderId, productId);
    return res.status(200).json({ success: true, item: removedItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

const axios = require("axios");

async function checkout(req, res) {
  try {
    const userId = req.user.id;

    // 1. Get all cart items
    const cartItems = await Cart.getCartItems(userId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Calculate total price
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });

    // 3. Create a new order in DB
    const order = await Order.createOrder(userId, totalPrice);

    // 🔐 4. Paymob Authentication - get token
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key:process.env.PAYMOB_API_KEY,
      }
    );

    const paymobToken = authResponse.data.token;

    // 🧾 5. Register order in Paymob
    const orderResponse = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: paymobToken,
        delivery_needed: "false",
        amount_cents: totalPrice * 100,
        currency: "EGP",
        items: [],
      }
    );

    const paymobOrderId = orderResponse.data.id;

    // 💳 6. Generate payment key
    const paymentKeyResponse = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: paymobToken,
        amount_cents: totalPrice * 100,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
          apartment: "803",
          email: "ahmed@example.com",
          floor: "8",
          first_name: "Ahmed",
          street: "Tahrir Street",
          building: "12B",
          phone_number: "01000000000",
          shipping_method: "PKG",
          postal_code: "12345",
          city: "Cairo",
          country: "EG",
          last_name: "Haggag",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }
    );

    const paymentToken = paymentKeyResponse.data.token;

    // 📦 7. Move items to order_items in DB
    await Order.addOrderItems(order.id, cartItems);

    // 🧹 8. Clear the cart
    await Cart.clearCart(userId);

    // 🧾 9. Return iframe URL to frontend
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      pay_url: iframeUrl,
      orderid: order.id,
    });
  } catch (error) {
    console.error("Checkout error:", error?.response?.data || error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = {
  getOrdersByUserId,
  createOrder,
  addItemsToOrder,
  removeItemFromOrder,
  checkout,
};
