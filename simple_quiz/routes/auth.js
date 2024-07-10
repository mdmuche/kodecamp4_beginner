var express = require("express");
const { userModel } = require("../models/userModel");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async function (req, res, next) {
  const { fullName, email, password } = req.body;

  console.log(req.body);

  const hashedPassword = bcrypt.hashSync(password, 10);

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

module.exports = router;
