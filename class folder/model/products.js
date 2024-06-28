const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const productCollection = mongoose.model("products", productSchema);

module.exports = {
  productCollection,
};
