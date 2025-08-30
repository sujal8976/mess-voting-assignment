import ErrorHandler from "../utils/errorHandler.js";
import MenuItem from "../models/menuItem.js";

export const addItem = async (req, res, next) => {
  try {
    const { name, isAvailable } = req.body;
    if (!name || !isAvailable) {
      throw new ErrorHandler("Provide name and isAvailable", 400);
    }

    const menuItem = await MenuItem.findOne({ name });
    if (menuItem) {
      throw new ErrorHandler("This Item is already in the list", 400);
    }

    const newMenuItem = new MenuItem({
      name,
      isAvailable,
    });
    await newMenuItem.save();

    res.status(201).json({
      success: true,
      message: "Added new Menu Item",
    });
  } catch (error) {
    if (error instanceof ErrorHandler) {
      next(error);
    } else {
      next(new ErrorHandler(error.message || "Something went wrong", 500));
    }
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const itemId = req.query.itemId;
    if (!itemId) {
      throw new ErrorHandler("Item Id is required", 404);
    }

    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      throw new ErrorHandler("Menu item not found", 404);
    }

    // Toggle availability
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      success: true,
      message: `Menu item is now ${
        menuItem.isAvailable ? "available" : "unavailable"
      }`,
      menuItem,
    });
  } catch (error) {
    if (error instanceof ErrorHandler) next(error);
    else next(new ErrorHandler(error.message || "Something went wrong", 500));
  }
};
