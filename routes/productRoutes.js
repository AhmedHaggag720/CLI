const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Get All Products
router.get("/", productController.getAllProducts);

// Get Product By ID
router.get("/:id", productController.getProductById);

// Add Product
router.post("/", productController.addProduct);

// Update Product
router.put("/:id", productController.updateProduct);

// Remove Product
router.delete("/:id", productController.removeProduct);


module.exports = router;
