const CustomErrorHandler = require("../error/CustomErrorHandler");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof CustomErrorHandler) {
    return res.status(err.statusCode).json({
      status: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // for unknown error
  return res.status(500).json({
    status: false,
    statusCode: 500,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
