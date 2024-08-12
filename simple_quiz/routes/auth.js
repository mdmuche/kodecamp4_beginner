var express = require("express");
const { userModel } = require("../models/userModel");
var router = express.Router();
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const tokenCollection = require("../models/tokenModel");

const saltRounds = 10;

router.post("/register", async function (req, res, next) {
  const { fullName, email, password } = req.body;

  const registerValidationSchema = joi.object({
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    role: joi.string(),
    password: joi.string().required().min(6).max(20),
  });

  const { error: validationError } = registerValidationSchema.validate({
    fullName,
    email,
    password,
  });

  if (validationError) {
    return res.send(validationError);
  }

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  await userModel.create({
    fullName,
    email,
    password: hashedPassword,
  });

  res.status(201).send({
    message: "created user successfully!",
  });
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  const loginValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(6).max(20),
  });

  const { error: validationError } = loginValidationSchema.validate({
    email,
    password,
  });

  if (validationError) {
    return res.send(validationError);
  }

  const userDetails = await userModel.findOne({ email });

  if (!userDetails) {
    res.status(404).send({
      message: "user not found",
    });
    return;
  }

  const passwordMatch = bcrypt.compareSync(password, userDetails.password);

  if (!passwordMatch) {
    res.status(404).send({
      message: "invalid credentials",
    });

    return;
  }

  const token = jwt.sign(
    {
      userId: userDetails._id,
      fullName: userDetails.fullName,
      email: userDetails.email,
      role: userDetails.role,
    },
    process.env.SECRET
  );

  res.send({
    message: "loggin succesful, welcome",
    userDetails: {
      fullName: userDetails.fullName,
      email: userDetails.email,
      role: userDetails.role,
    },
    token,
  });
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailValidation = joi.string().email().required().messages({
      "string.email": "your email is not valid",
      "any.required": "email field is required",
    });

    await emailValidation.validateAsync(email);

    if (!email) {
      return res.status(400).send({ message: "invalid input" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(404).send({
        message: "user not found",
      });
      return;
    }

    const token = v4();

    await tokenCollection.create({
      userId: user._id,
      token,
    });

    res.status(201).send({
      message: "password reset token generated",
      token,
    });
  } catch (err) {
    console.error("server error", err.message);
    return res
      .status(500)
      .send({ message: "internal server error", error: err.message });
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const resetPasswordValidation = joi.object({
      token: joi.string().required(),
      newPassword: joi.string().required().min(6).max(20),
    });

    const { error: resetPasswordError } = resetPasswordValidation.validate({
      token,
      newPassword,
    });

    if (resetPasswordError) return res.send(resetPasswordError);

    const resetToken = await tokenCollection.findOne({ token });

    if (!resetToken) {
      res.status(404).send("invalid or expired token");
      return;
    }

    const user = await userModel.findById(resetToken.userId);

    if (!user) {
      res.status(404).send({
        message: "user not found",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    const newAuthToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.SECRET
    );

    await userModel.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
      authToken: newAuthToken,
    });

    await tokenCollection.deleteOne({ token });

    res.send({ message: "password reset was successful" });
  } catch (err) {
    console.error("server error", err.message);
    return res
      .status(500)
      .send({ message: "internal server error", error: err.message });
  }
});

module.exports = router;
