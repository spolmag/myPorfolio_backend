import mongoose, { mongo } from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    lineId: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Contact = mongoose.model("Contact", contactSchema);
