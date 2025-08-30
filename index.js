import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import voteRouter from "./routes/vote.js";
import menuRouter from "./routes/menu.js";
import adminRouter from "./routes/admin.js";
import errorMiddleware from "./middleware/error.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();
app.use(express.static("public"));

app.get("/h", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

// routes
app.use("/api/admin", adminRouter);
app.use("/api/vote", voteRouter);
app.use("/api/menu", menuRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, async () => {
  console.log(`Server is listening on Port ${process.env.PORT}`);
  await connectToDatabase();
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Failed to connect to database");
  }
};
