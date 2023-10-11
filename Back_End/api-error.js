class ApiError extends Error{
  constructor(statusCode, message, constraint){
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.constraint = constraint || null;
  }
}

module.exports = ApiError;