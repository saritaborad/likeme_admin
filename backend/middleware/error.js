// const errorResponse = require('./errorResponse');
const ErrorResponse = require("./errorResponse");

const errorHandler = (err, req, res, next) => {
 let error = { ...err };
 error.message = err.message;

 //Mongoose Bad Object
 if (err.name === "CastError") {
  error = new ErrorResponse(err.message, 400);
 }

 //Mongoose Duplicate key
 if (err.code === 11000) {
  const message = "Duplicate field Value entered";
  error = new ErrorResponse(message, 400);
 }

 //Mongoose validation Error
 if (err.name === "ValidationError") {
  const message = Object.values(err.errors).map((val) => val.message);
  error = new ErrorResponse(message, 400);
 }

 return res.status(error.statusCode || 500).json({
  success: false,
  error: error.message || "Server Error",
 });
};

module.exports = errorHandler;
