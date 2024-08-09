var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userCollection } = require("../model/userModel");
var router = express.Router();

router.post("/register", async function (req, res, next) {
  try {
    const { fullName, userName, email, password } = req.body;

    const userNameAlreadyExist = await userCollection.exists({ userName });

    if (userNameAlreadyExist) {
      res.status(409).send({
        message: "username already exist",
      });
      return;
    }

    const acoountAlreadyExist = await userCollection.exists({ email });

    if (acoountAlreadyExist) {
      res.status(409).send({
        message: "email already exist",
      });
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await userCollection.create({
      fullName,
      userName,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      message: "user created",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { emailOrUserName, password } = req.body;

    const user = await userCollection.findOne({
      $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
    });

    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    }

    const doesPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!doesPasswordMatch) {
      return res.status(404).send({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.AUTH_KEY
    );
    res.send({
      message: "login was successful!",
      user: {
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
