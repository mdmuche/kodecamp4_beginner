var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
var http = require("http");
const { Server } = require("socket.io");

var adminRouter = require("./routes/admin");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
const sharedRouter = require("./routes/shared");

var app = express();

/**
 * Get port from environment and store in Express.
 */

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
const io = new Server(server);

/**
 * Listen on provided port, on all network interfaces.
 */

io.use((socket, next) => {
  try {
    console.log("a user is trying to connect");
    const authToken = socket.handshake.headers.authorization.split(" ");
    const strategy = authToken[0];
    const tokenItSelf = authToken[1];

    if (strategy.toLocaleLowerCase() != "bearer") {
      socket.send("Error: strategy is incorrect");
      return;
    }

    const userDetails = jwt.verify(tokenItSelf, process.env.SECRET);

    socket.handshake.auth.userDetails = userDetails;

    next();
  } catch (err) {
    next(err);
  }
});

io.on("connection", (socket) => {
  socket.emit(
    "connection_response",
    `Welcome, you're connected this is your ID:
    ${socket.id}`
  );
  console.log("A new connection detected. the connection ID is", socket.id);
  const userDetails = socket.handshake.auth.userDetails;

  socket.join(userDetails.userId);

  socket.on("greet", (greetingMessage) => {
    console.log("this is a greeting to you:", greetingMessage);
    socket.send("the server has received your greeting");
    socket.send("and i want to thankyou for greeting me");
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected the user ID is", socket.id);
    socket.leave(userDetails.userId);
  });
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("an error occured", err);
  });

app.use(
  cors({
    origin: process.env.WHITELIST,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.use("/v1/auth", authRouter);
app.use("/v1/admin", adminRouter);
app.use("/v1/users", usersRouter);
app.use("/v1/shared", sharedRouter);

// app.get("/", (req, res) => {
//   res.status(200);
// });

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

module.exports = { server, port };
