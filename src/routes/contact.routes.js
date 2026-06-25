import { Router } from "express";
import {
  getContacts,
  createContact,
} from "../models/contact/contact.controller.js";

export const router = Router();

router.get("/", getContacts);
router.post("/", createContact);
