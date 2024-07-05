const express = require("express");
const jwt = require("jsonwebtoken");
const { productModel } = require("../models/productModel");
require("dotenv").config();

const productRoute = express.Router();

function checkIfLoggedIn(req, res, next) {
  const authToken = req.headers.authorization.split(" ");
  const strategy = authToken[0];
  const tokenItself = authToken[1];

  if (!authToken) {
    res.status(403).send({
      message: "no token present",
    });
    return;
  }

  if (strategy == "Bearer") {
    const userDetails = jwt.verify(tokenItself, process.env.AUTH_KEY);

    req.userDetails = userDetails;

    next();
  } else {
    res.status(403).send({
      message: "invalid auth strategy",
    });
  }
}

async function checkBeforeDelete(req, res, next) {
  const product = await productModel.findById(req.params.id);
  if (req.userDetails.userId == product.productOwner) {
    next();
  } else {
    res.status(401).send({
      message:
        "you cannot delete this because you are not the owner of the product",
    });
  }
}

productRoute.use(checkIfLoggedIn);

productRoute.get("/products", async (req, res) => {
  const product = await productModel.find({
    productOwner: req.userDetails.userId,
  });

  res.send({ product });
});

productRoute.post("/product", async (req, res) => {
  const newProduct = await productModel.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    productOwner: req.userDetails.userId,
  });

  res.send({ newProduct });
});

productRoute.delete("/:id", checkBeforeDelete, async (req, res) => {
  await productModel.findByIdAndDelete(req.params.id);
  res.send({ message: "product has been deleted successfully!" });
});

module.exports = productRoute;
