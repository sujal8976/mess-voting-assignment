import ErrorHandler from "../utils/errorHandler.js";

export const isAdmin = (req, res, next) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const adminPass = req.body.adminPass;
    if (!adminPass || adminPass !== adminSecret) {
      throw new ErrorHandler("You are not an admin", 401);
    }

    next();
  } catch (error) {
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler("Failed to Authenticate an admin", 500));
    }
  }
};
