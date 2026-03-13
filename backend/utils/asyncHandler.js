/**
 * Async Handler Utility
 * Wraps asynchronous route handlers to automatically catch errors
 * and pass them to the global error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
