const Joi = require("joi");
const { userData } = require("../models");
const CustomErrorHandler = require("../error/CustomErrorHandler");

exports.registerSchema = async (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  try {
    const exist = await userData.exists({ email: req.body.email });
    if (exist) {
      return next(
        CustomErrorHandler.alreadyExist("This email is already taken")
      );
    }
  } catch (err) {
    return next(err);
  }
};
