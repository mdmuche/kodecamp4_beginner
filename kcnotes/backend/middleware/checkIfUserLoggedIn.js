const jwt = require("jsonwebtoken");

const isUserLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).send({
      message: "you are not allowed to view this route",
    });
    return;
  }

  const authToken = authHeader.split(" ");
  const strategu = authToken[0];
  const tokenItSelf = authToken[1];

  if (strategu.toLocaleLowerCase() != "bearer") {
    return res.status(400).send({ message: "use a valid auth strategy" });
  } else if (!authToken) {
    res.status(400).send({
      message: "no token found",
    });
  } else {
    const userDetails = jwt.verify(tokenItSelf, process.env.AUTH_KEY);

    req.userDetails = userDetails;

    next();
  }
};

module.exports = {
  isUserLoggedIn,
};
