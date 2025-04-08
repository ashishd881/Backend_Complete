//api error s ko handle karne ke liye ye file banaayi hai      https://nodejs.org/api/errors.html#new-errormessage-options
//ye nodejs humko feature deta hai taki response ke liye hum express ka use karte hai but express is tarah ka feature nahi deta hai so we create a class in api resopnse file

class ApiError extends Error {                   //ApiError class inherit all the features of the built-in Error class."
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "" //errorStack
  ) {
    //yaha se constructor me overwrite karenge
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); //stack trace ke andar instance pass kar diya
    }
  }
}

export { ApiError };
