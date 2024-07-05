const express = require("express");
const { productsModel } = require("../model/products");
const { ordersModel } = require("../model/order");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("welcome to index");
});

router.post("/product", async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    await productsModel.create({
      name,
      description,
      price,
    });

    res.status(201).send("product created successfully!");
  } catch (err) {
    next(err);
  }
});

router.get("/products/:limit/:page", async (req, res, next) => {
  try {
    const { limit, page } = req.params;
    const products = await productsModel.paginate({}, { page, limit });
    res.send({ products });
  } catch (err) {
    next(err);
  }
});

router.post("/order", async (req, res, next) => {
  try {
    const { products } = req.body;

    await ordersModel.create(products);

    res.status(201).send({
      message: "order created",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/orders", async (req, res, next) => {
  try {
    const orders = await ordersModel
      .find({}, "product itemCount")
      .populate("product", "name price");

    res.send(orders);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
