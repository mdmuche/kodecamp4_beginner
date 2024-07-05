const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("connection to db was successful");
  })
  .catch((err) => {
    console.error("connection to db wasn't successful!", err);
  });

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
