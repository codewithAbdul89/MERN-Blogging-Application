class ApiError extends Error {
  constructor(statusCode, message,errorCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.errorCode = errorCode;
  }
}

export default ApiError;
