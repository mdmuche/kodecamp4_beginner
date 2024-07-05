const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const mongooseSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongooseSchema.plugin(paginate);

const ordersModel = mongoose.model("orders", mongooseSchema);

module.exports = {
  ordersModel,
};
