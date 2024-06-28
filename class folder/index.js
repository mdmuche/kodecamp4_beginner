const express = require("express");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

const productRoute = require("./routes/product");
const userRoute = require("./routes/user");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));

const connection = mongoose.connect("mongodb://localhost:27017/kodecamp4");

connection
  .then(() => {
    console.log("connected to mongodb successfully!");
  })
  .catch((err) => {
    console.log("an error occured while trying to connect, Error:", err);
  });

app.use("/products", productRoute);
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`listening for request at port ${port}`);
});
