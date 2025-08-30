import mongoose from "mongoose";

const menuItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("MenuItem", menuItemSchema);
