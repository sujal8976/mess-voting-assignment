import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  studentRoll: {
    type: String,
    required: true,
    lowercase: true,
  },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Vote", voteSchema);
