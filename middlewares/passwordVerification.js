const CustomErrorHandler = require("../error/CustomErrorHandler");

const passwordVerify = (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return next(CustomErrorHandler.passLength("Password does not match"));
  }
  next();
};

module.exports = passwordVerify;
