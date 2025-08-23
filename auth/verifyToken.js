const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const CustomErrorHandler = require("../error/CustomErrorHandler");

exports.verifyToken = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return next(CustomErrorHandler.unAuthorized("Unauthorized access"));
  }

  const token = auth.split(" ")[1];
  try {
    if (token) {
      const accessToken = jwt.verify(token, JWT_SECRET);
      if (!accessToken) throw new Error("Invalid access token");
      req.token = accessToken;
      next();
    }
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized(error.message));
  }
};
