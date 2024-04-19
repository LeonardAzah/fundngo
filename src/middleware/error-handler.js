const logger = require("../utils/logger");

const errorHandlerMiddleware = (error, req, res, next) => {
  const customError =
    error.constructor.name === "NodeError" ||
    error.constructor.name === "SyntaxError"
      ? false
      : true;
  logger.error({
    StatusCode: error.statusCode,
    ErrorMessage: error.message,
    ErrorName: error.type,
  });
  console.log(error);
  res.status(error.statusCode || 500).json({
    response: "Error",
    error: {
      type: customError === false ? "UnhandledError" : error.constructor.name,
      statusCode: error.statusCode || 500,
      message: error.message,
    },
  });
};

module.exports = errorHandlerMiddleware;
