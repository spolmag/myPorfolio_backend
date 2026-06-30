import { Router } from "express";

export const router = Router();

import {
  getUsers,
  createUser,
  userLogin,
  userLogout,
  updateUser,
  deleteUser,
  changePassword,
  updateMyProfile,
  getMyProfile,
} from "../models/user/user.controller.js";
import { authUser, adminOnly } from "../middleware/authUser.js";

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/", authUser, adminOnly, getUsers);
router.post("/", authUser, adminOnly, createUser);
router.put("/me", authUser, updateMyProfile);
router.get("/me", authUser, getMyProfile);
router.put("/me/password", authUser, changePassword);
router.put("/:id", authUser, adminOnly, updateUser);
router.delete("/:id", authUser, adminOnly, deleteUser);
