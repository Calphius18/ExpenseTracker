/**
 * Global Error Handler Middleware
 * Standardizes error responses across the application
 */
const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorMiddleware;
