import mongoose from "mongoose";

const TrophySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // removes extra spaces
  },
  shortDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Fibre Cups", "Corporate Mementos", "Economy"],
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  height: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trophy = mongoose.model("Trophy", TrophySchema);

export default Trophy;
