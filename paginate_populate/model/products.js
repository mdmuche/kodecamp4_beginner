const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const mongooseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongooseSchema.plugin(paginate);

const productsModel = mongoose.model("products", mongooseSchema);

module.exports = {
  productsModel,
};
