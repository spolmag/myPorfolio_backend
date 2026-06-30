import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "./user.model.js";
import { authUser } from "../../middleware/authUser.js";

//Hide password when response to client
const hidePassword = (userData) => {
  if (!userData) {
    return null;
  }

  //If userData is array of user
  if (Array.isArray(userData)) {
    return userData.map((eachUser) => hidePassword(eachUser));
  }
  //If data is mongoose document, convert to object and hide password
  let userObj =
    typeof userData.toObject === "function"
      ? userData.toObject()
      : { ...userData };
  delete userObj.password;
  return userObj;
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password is required!" });
  }

  try {
    const foundUser = await User.findOne({ email }).select("+password");
    if (!foundUser) {
      return res
        .status(401)
        .json({ success: false, message: `Email ${email} not found!` });
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong password!" });
    }

    //Make token
    const token = jwt.sign(
      { userId: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const isProd = process.env.NODE_ENV === "production";
    //Setup token
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login success.",
      data: {
        _id: foundUser._id,
        userName: foundUser.userName,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = (req, res) => {
  const isPord = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isPord,
    sameSite: isPord ? "none" : "lax",
    path: "/",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully." });
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({ success: true, data: allUsers });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { userName, email, password, role } = req.body || {};

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "User name, email, password is required!",
    });
  }

  try {
    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registed!" });
    }

    const newUser = await User.create({
      userName,
      email,
      password,
      role,
    });

    return res.status(201).json({ success: true, data: hidePassword(newUser) });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { userName, email, role } = req.body || {};

  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: `User id ${id} not found!` });
    }
    if (userName !== undefined) foundUser.userName = userName;
    if (email !== undefined) foundUser.email = email;
    if (role !== undefined) foundUser.role = role;

    const saveUser = await foundUser.save();
    return res.status(200).json({ success: true, data: foundUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: `User ID ${id} not found!` });
    }

    const userName = foundUser.userName;
    await foundUser.deleteOne();
    return res.status(200).json({
      success: true,
      message: `User ID ${id} - ${userName} success deleted`,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password is required!",
    });
  }

  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId).select("+password");
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User noot found!" });
    }
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      foundUser.password,
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password incorrect!" });
    }
    foundUser.password = newPassword;
    await foundUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password change successful" });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  const { userName } = req.body || {};
  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    if (userName !== undefined) {
      foundUser.userName = userName;
    }
    const saveUser = await foundUser.save();
    return res.status(200).json({
      success: true,
      message: "User name update successfully.",
      data: { _id: saveUser._id, userName: saveUser.userName },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User session end or session not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
