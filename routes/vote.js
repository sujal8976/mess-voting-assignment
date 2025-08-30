import { Router } from "express";
import { vote } from "../controllers/vote.js";

const voteRouter = Router();

voteRouter.post("/", vote);

export default voteRouter;
