import { Router } from "express";
import {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact,
} from "../models/contact/contact.controller.js";
import { authUser, adminOnly } from "../middleware/authUser.js";

export const router = Router();

router.get("/", authUser, adminOnly, getContacts);
router.post("/", createContact);
router.put("/:id", authUser, adminOnly, updateContactStatus);
router.delete("/:id", authUser, adminOnly, deleteContact);
