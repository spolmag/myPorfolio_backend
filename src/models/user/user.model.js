import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, //Prevent return password to client
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

//Use bcrypt.hash to convert password when save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});

export const User = mongoose.model("User", userSchema);
