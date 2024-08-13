const express = require("express");
const { userModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { sendEmail } = require("../utils/emailUtils");
require("dotenv").config();

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const token = v4();

  await userModel.create({
    fullName,
    email,
    password: hashedPassword,
    authToken: token,
    authPurpose: "verify-email",
  });

  await sendEmail(
    email,
    "verify email",
    "hello " +
      fullName +
      " the link to verify your email is http://localhost:3000/auth/verify-email/" +
      token
  );

  res.status(201).send({
    isSuccessful: true,
    message: "kindly check your email to verify it.",
  });
});

authRouter.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  const doesUserExist = await userModel.exists({
    authToken: token,
    authPurpose: "verify-email",
  });

  if (!doesUserExist) {
    res.status(404).send({
      isSuccessful: false,
      message: "the user does not exist",
    });
    return;
  }

  await userModel.findOneAndUpdate(
    {
      authToken: token,
      authPurpose: "verify-email",
    },
    {
      isEmailVerified: true,
      authToken: "",
      authPurpose: "",
    }
  );

  res.send({
    isSuccessful: true,
    message: "Email verified successfully!",
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(404).send({
      isSuccessful: false,
      message: "user does not exist",
    });
    return;
  }

  const doesPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!doesPasswordMatch) {
    res.status(404).send({
      isSuccessful: false,
      message: "invalid-credentials",
    });
    return;
  }

  const userToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.AUTH_KEY
  );

  res.send({
    isSuccessful: true,
    userDetail: {
      fullName: user.fullName,
      email: user.email,
    },
    userToken,
    message: "logged in successful",
  });
});

module.exports = authRouter;
