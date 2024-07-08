const jwt = require("jsonwebtoken");

const verifyAuth = (req, res, next) => {
  const strategyAndToken = req.headers.authorization.split(" ");
  const strategy = strategyAndToken[0];
  const tokenItself = strategyAndToken[1];

  if (strategy.toLocaleLowerCase() == "bearer") {
    const userDetails = jwt.verify(tokenItself, process.env.SECRET);

    req.userDetails = userDetails;

    if (userDetails) {
      next();
    }
  } else {
    res.status(403).send({
      message: "you are not authorized",
    });
  }
};

module.exports = verifyAuth;
