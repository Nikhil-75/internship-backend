const express = require("express");
const { verifyToken, mailVerify } = require("../auth/verifyToken");
const { refreshTokenVerify } = require("../auth/refreshTokenVerify");
const userCon = require("../controllers/userController");
const passwordVerify = require("../middlewares/passwordVerification");
const { registerSchema } = require("../services/schemaValidator");
const router = express.Router();

router.get("/", userCon.getApi);

router.post("/register", registerSchema, userCon.userRegister);
router.post("/login", userCon.userLogin);
router.post("/forgot-password", userCon.forgetPassword);
router.post("/otp-verification", userCon.otpVerify);

router.put(
  "/verify-reset-password",
  verifyToken,
  passwordVerify,
  userCon.resetPassword
);

router.post(
  "/access-token-generate",
  refreshTokenVerify,
  userCon.genAccessToken
);

module.exports = router;
