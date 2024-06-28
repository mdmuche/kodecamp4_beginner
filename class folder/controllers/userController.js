const { userCollection } = require("../model/users");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const userDetails = req.body;

  const hashedPassword = bcrypt.hashSync(userDetails.password, 10);

  await userCollection.create({
    fullName: userDetails.fullName,
    email: userDetails.email,
    password: hashedPassword,
  });

  res.status(201).send({ message: "user created" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userCollection.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: "user not found" });
  }

  const doesPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!doesPasswordMatch) {
    return res.status(404).send("invalid user");
  }

  res.send({ message: "login was successful" });
};

module.exports = {
  signup,
  login,
};
