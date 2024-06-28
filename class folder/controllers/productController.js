const { productCollection } = require("../model/products");

const createProduct = async (req, res) => {
  const productDetails = req.body;

  await productCollection.create({
    productName: productDetails.productName,
    productPrice: productDetails.productPrice,
  });

  res.send({ message: "product created successfully" });
};

const getAllProducts = async (req, res) => {
  const products = await productCollection.find({});
  res.send(products);
};

const getProduct = async (req, res) => {
  const product = await productCollection.findById(req.params.id);
  res.json(product);
};

const updateProduct = async (req, res) => {
  const productDetails = req.body;
  await productCollection.findByIdAndUpdate(req.params.id, {
    productName: productDetails.productName,
    productPrice: productDetails.productPrice,
  });

  res.send({ message: "product updated successsfully" });
};

const deleteProduct = async (req, res) => {
  await productCollection.findByIdAndDelete(req.params.id);
  res.send({ message: "product deleted successfully!" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
