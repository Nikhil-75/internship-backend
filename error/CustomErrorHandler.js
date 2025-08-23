class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.status = false;        
    this.statusCode = statusCode;  
    this.message = message;       
  }

  static Error404(message = "Sorry page not available") {
    return new CustomErrorHandler(404, message);
  }

  static wrongCredentials(message = "Email or password is wrong") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "Unauthorized login") {
    return new CustomErrorHandler(401, message);
  }

  static wrongOtp(message = "Invalid OTP") {
    return new CustomErrorHandler(401, message);
  }

  static alreadyExist(message = "Already exists") {
    return new CustomErrorHandler(409, message);
  }

  static notFound(message = "404 not found") {
    return new CustomErrorHandler(404, message);
  }

  static passLength(message = "Password must be at least 5 characters long") {
    return new CustomErrorHandler(400, message);
  }
}

module.exports = CustomErrorHandler;
