/* */

class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, AppError);
  }
}

export {
  AppError
};
