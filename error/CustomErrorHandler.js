class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.status = false;
    this.statusCode = statusCode;
    this.message = message;
  }

  static Error404(message = "Sorry, page not available") {
    return new CustomErrorHandler(404, message);
  }

  static wrongCredentials(message = "Email or password is wrong") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "Unauthorized access") {
    return new CustomErrorHandler(401, message);
  }

  static wrongOtp(message = "Invalid OTP") {
    return new CustomErrorHandler(400, message);
  }

  static alreadyExist(message = "Already exists") {
    return new CustomErrorHandler(409, message);
  }

  static notFound(message = "Resource not found") {
    return new CustomErrorHandler(404, message);
  }

  static invalidPassword(message = "Invalid password format") {
    return new CustomErrorHandler(400, message);
  }

  static passLength(message = "Password must be 6 to 8 characters") {
    return new CustomErrorHandler(400, message);
  }

  static passwordMismatch(message = "Confirm password must match") {
    return new CustomErrorHandler(400, message);
  }

  static firstNameError(message = "Firstname must be alphabets only") {
    return new CustomErrorHandler(400, message);
  }

  static firstNameLength(message = "Firstname at least 3 characters") {
    return new CustomErrorHandler(400, message);
  }

  static lastNameError(message = "Lastname must be alphabets only") {
    return new CustomErrorHandler(400, message);
  }

  static lastNameLength(message = "Lastname at least 3 characters") {
    return new CustomErrorHandler(400, message);
  }

  static emailError(message = "Email must be a valid Gmail ID") {
    return new CustomErrorHandler(400, message);
  }
}

module.exports = CustomErrorHandler;
