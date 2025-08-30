export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development")
    console.error(`[ERROR] ${statusCode} - ${message}`);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
};

export default errorMiddleware;
