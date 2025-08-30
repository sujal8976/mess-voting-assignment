import Vote from "../models/vote.js";
import MenuItem from "../models/menuItem.js";
import ErrorHandler from "../utils/errorHandler.js";

export const vote = async (req, res, next) => {
  try {
    const { studentRoll, menuItemId } = req.body;
    if (!studentRoll || !menuItemId) {
      throw new ErrorHandler("Student Roll and MenuItem are required", 400);
    }

    const todayDate = getISTDayKey();

    const vote = await Vote.findOne({
      date: todayDate,
      studentRoll,
    });
    if (vote && vote.date === todayDate) {
      throw new ErrorHandler("You already voted for today.", 400);
    }

    const item = await MenuItem.findOne({
      _id: menuItemId,
      isAvailable: true,
    });
    if (!item) {
      throw new ErrorHandler("Invalid or inactive menu item", 400);
    }

    const newVote = new Vote({
      studentRoll,
      menuItemId,
      date: todayDate,
    });
    await newVote.save();

    res.status(201).json({
      success: true,
      message: `Today's vote registered for student roll no: ${studentRoll}.`,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler(error.message || "Something went wrong", 500));
  }
};

const getISTDayKey = (d = new Date()) => {
  const ist = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const y = ist.getFullYear();
  const m = String(ist.getMonth() + 1).padStart(2, "0");
  const day = String(ist.getDate()).padStart(2, "0");
  return `${day}-${m}-${y}`;
};
