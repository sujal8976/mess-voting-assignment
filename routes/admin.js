import { Router } from "express";
import { addItem, updateItem } from "../controllers/admin.js";
import { isAdmin } from "../middleware/isAdmin.js";

const adminRouter = Router();

adminRouter.post("/addItem", isAdmin, addItem);
adminRouter.post("/updateItem", isAdmin, updateItem);

export default adminRouter;