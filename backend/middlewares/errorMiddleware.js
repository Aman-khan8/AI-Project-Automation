import ApiResponse from "../utils/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500;

  //for development purpose
  console.error(`[Error] ${req.method} ${req.url}:`, err.message);

  const response = new ApiResponse(
    statusCode,
    "error",
    err.message || "Internal Server Error",
    null,
  );

  return res.status(statusCode).json(response);
};

export default errorHandler;
