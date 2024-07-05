const express = require("express");
const logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");

const productRoute = require("./routesAndControllers/productRoutes");
const userRoute = require("./routesAndControllers/authenticationRoutes");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(logger("dev"));

const connection = mongoose.connect(process.env.URL);

connection
  .then(() => {
    console.log("connected to mongodb successfully!");
  })
  .catch((err) => {
    console.log("an error occured while trying to connect, Error:", err);
  });

app.use("/auth", userRoute);
app.use("/product", productRoute);

app.listen(port, () => {
  console.log(`listening for request at port ${port}`);
});
