const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const productRoute = express.Router();

productRoute.post("/", createProduct);

productRoute.get("/", getAllProducts);

productRoute.get("/:id", getProduct);

productRoute.put("/:id", updateProduct);

productRoute.delete("/:id", deleteProduct);

module.exports = productRoute;
