import ErrorHandler from "../utils/errorHandler.js";
import Vote from "../models/vote.js";
import MenuItem from "../models/menuItem.js";

export const getMenu = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const topItems = await Vote.aggregate([
      {
        $group: {
          _id: "$menuItemId", // group by menuItemId
          votes: { $sum: 1 }, // count votes
        },
      },
      { $sort: { votes: -1 } }, // sort by votes descending
      { $limit: limit },
      {
        $lookup: {
          from: "menuitems", // collection name in MongoDB (lowercased plural of model)
          localField: "_id",
          foreignField: "_id",
          as: "menuItem",
        },
      },
      { $unwind: "$menuItem" }, // flatten the menuItem array
      {
        $project: {
          _id: 0,
          id: "$menuItem._id",
          name: "$menuItem.name",
          isAvailable: "$menuItem.isAvailable",
          votes: 1,
        },
      },
    ]);
    if (!topItems.length) {
      throw new ErrorHandler("No menu items found", 404);
    }

    res.status(200).json({
      success: true,
      topItems,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler(error.message || "Internal error", 500));
  }
};

export const getAllMenu = async (req, res, next) => {
  try {
    const { isAvailable } = req.query;

    let filter = {};

    if (isAvailable === "true") {
      filter.isAvailable = true;
    }

    const menu = await MenuItem.find(filter);

    if (!menu || !menu.length) {
      throw new ErrorHandler("No menu items found", 404);
    }

    res.status(200).json({
      success: true,
      menu,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler(error.message || "Something went wrong", 500));
  }
};
