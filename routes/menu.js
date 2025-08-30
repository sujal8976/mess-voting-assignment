import { Router } from "express";
import { getMenu, getAllMenu } from "../controllers/menu.js";

const menuRouter = Router();

menuRouter.get("/top", getMenu);
menuRouter.get("/all", getAllMenu);

export default menuRouter;
