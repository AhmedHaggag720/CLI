const Order = require('../models/orderModel');

// Get Orders by User ID
async function getOrdersByUserId(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.getOrdersByUserId(userId);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
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
    const {total } = req.body;

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

module.exports = {
  getOrdersByUserId,
  createOrder,
  addItemsToOrder,
  removeItemFromOrder
};
