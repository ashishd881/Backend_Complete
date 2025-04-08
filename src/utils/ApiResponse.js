class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //because this is a apiResponse
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
  }
}

export { ApiResponse };
