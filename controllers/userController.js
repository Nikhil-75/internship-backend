const { userData, RefreshToken } = require("../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_SECRET } = require("../config");
const CustomErrorHandler = require("../error/CustomErrorHandler");
const otpGenerator = require("otp-generator");

const salt = 10;
let otpMemoryStore = {}; // OTP memory store

// ---------------- API Test ----------------
exports.getApi = (req, res) => {
  res.status(200).json({
    status: true,
    statusCode: 200,
    message: "API is working fine!"
  });
};

// ---------------- User Register ----------------
exports.userRegister = async (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9!@#$]{5,30}$"))
      .min(6)
      .max(30)
      .required(),
    confirm_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);
  if (error) return next(CustomErrorHandler.passLength(error.message));

  try {
    const exist = await userData.exists({ email: req.body.email });
    if (exist) {
      return next(CustomErrorHandler.alreadyExist("This email already exists"));
    }

    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new userData({ firstName, lastName, email, password: hashedPassword });
    const result = await user.save();

    const access_token = jwt.sign({ _id: result._id }, JWT_SECRET, { expiresIn: "2h" });
    const refresh_token = jwt.sign({ _id: result._id }, REFRESH_SECRET, { expiresIn: "1y" });

    await RefreshToken.create({ token: refresh_token, email });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "User registered successfully",
      data: { access_token, refresh_token }
    });
  } catch (err) {
    next(err);
  }
};

// ---------------- User Login ----------------
exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userData.findOne({ email });
    if (!user) {
      return next(CustomErrorHandler.notFound("Invalid email"));
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, { expiresIn: "2h" });
      const refresh_token = jwt.sign({ _id: user._id }, REFRESH_SECRET, { expiresIn: "1y" });

      const emailFind = await RefreshToken.findOne({ email });
      if (emailFind) {
        await RefreshToken.findOneAndUpdate({ email }, { token: refresh_token }, { new: true });
      } else {
        await RefreshToken.create({ token: refresh_token, email });
      }

      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Login successful",
        data: { access_token: token, refresh_token }
      });
    }
    return next(CustomErrorHandler.wrongCredentials("Invalid password"));
  } catch (error) {
    next(error);
  }
};

// ---------------- Generate Access Token (from refresh) ----------------
exports.genAccessToken = async (req, res, next) => {
  const Id = req.token._id;
  try {
    const user = await userData.findById(Id);
    if (!user) return next(CustomErrorHandler.notFound("User not found"));

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: "2h" });
    return res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Access token generated successfully",
      data: { access_token: token }
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- Forget Password (OTP Generate) ----------------
exports.forgetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const exist = await userData.exists({ email });
    if (!exist) {
      return next(CustomErrorHandler.notFound("Invalid email"));
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    otpMemoryStore[email] = otp;

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "OTP generated successfully",
      data: { otp } // sirf testing ke liye
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- OTP Verify ----------------
exports.otpVerify = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await userData.findOne({ email });

    if (!user) return next(CustomErrorHandler.notFound("Invalid email"));

    if (otpMemoryStore[email] && otpMemoryStore[email] === otp) {
      const updatedUser = await userData.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      );

      delete otpMemoryStore[email];

      const token = jwt.sign({ user_id: updatedUser._id }, JWT_SECRET, { expiresIn: "15m" });

      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "OTP verified successfully",
        data: { access_token: token }
      });
    } else {
      return next(CustomErrorHandler.wrongOtp("Invalid OTP"));
    }
  } catch (error) {
    next(error);
  }
};

// ---------------- Reset Password ----------------
exports.resetPassword = async (req, res, next) => {
  try {
    const Id = req.token.user_id;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, salt);
    await userData.findByIdAndUpdate(Id, { password: hashedPassword }, { new: true });

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
};
