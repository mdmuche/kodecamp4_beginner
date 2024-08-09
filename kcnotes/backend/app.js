var createError = require("http-errors");
var express = require("express");
const mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

mongoose
  .connect("mongodb://localhost:27017/kc_notes")
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log("not connect to db. Error:", err.message);
  });

app.use(cors("*"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/note", indexRouter);
app.use("/auth", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send(res.locals.error);
});

module.exports = app;
