class CustomAPIError extends Error {
  statusCode;

  constructor(message, statusCode) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
  }
}

module.exports = CustomAPIError;
