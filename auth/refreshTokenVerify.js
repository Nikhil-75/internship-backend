const jwt = require("jsonwebtoken");
const { REFRESH_SECRET } = require("../config");
const CustomErrorHandler = require("../error/CustomErrorHandler");

exports.refreshTokenVerify = async (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return next(CustomErrorHandler.unAuthorized("Unauthorized access"));
  }

  const token = auth.split(" ")[1];
  try {
    if (token) {
      const refreshToken = jwt.verify(token, REFRESH_SECRET);
      if (!refreshToken) {
        return next(CustomErrorHandler.wrongCredentials("Invalid refresh token"));
      }
      req.token = refreshToken;
      next();
    }
  } catch (error) {
    return next(CustomErrorHandler.unAuthorized(error.message));
  }
};
