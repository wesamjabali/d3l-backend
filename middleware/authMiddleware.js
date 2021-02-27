const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // Get the token from the request header
      const token = req.headers.authorization.split(" ")[1];
      // Verify the token & append to req, this will throw an error if the token is invalid
      req.user = jwt.verify(token, process.env.AUTH_CLIENT_SECRET);
      next();
    } else {
      throw new Error("User Auth Middleware - No Auth Provided - 401");
    }
  } catch (err) {
    console.log("Auth Error -> ", err);
    // send 401 & propagate
    res.status(401).json({});
    next(err);
  }
};
