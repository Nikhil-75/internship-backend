const Joi = require("joi");
const { userData } = require("../models");
const CustomErrorHandler = require("../error/CustomErrorHandler");

exports.registerSchema = async (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    email: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail\\.com$")) // only Gmail
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,8}$"
        )
      )
      .required(),
    confirm_password: Joi.ref("password"),
  }).messages({
    "any.only": "Confirm password must match",
  });

  const { error } = registerSchema.validate(req.body);
  if (error) {
    if (error.message.includes("firstName")) {
      return next(CustomErrorHandler.firstNameError("Firstname at least 3 characters"));
    }
    if (error.message.includes("lastName")) {
      return next(CustomErrorHandler.lastNameError("Lastname at least 3 characters"));
    }
    if (error.message.includes("email")) {
      return next(CustomErrorHandler.emailError("Email must be a valid Gmail ID"));
    }
    if (error.message.includes("pattern")) {
      return next(CustomErrorHandler.invalidPassword("Invalid password format"));
    }
    if (error.message.includes("Confirm password must match")) {
      return next(CustomErrorHandler.passwordMismatch("Confirm password must match"));
    }
    return next(CustomErrorHandler.passLength("Password must be 6 to 8 characters"));
  }

  try {
    const exist = await userData.exists({ email: req.body.email });
    if (exist) {
      return next(CustomErrorHandler.alreadyExist("This email is already taken"));
    }
    next();
  } catch (err) {
    return next(err);
  }
};