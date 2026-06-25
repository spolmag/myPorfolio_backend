import { Router } from "express";
import { router as contactRouter } from "./contact.routes.js";
import { router as userRouter } from "./user.routes.js";

export const router = Router();

router.use("/contact", contactRouter);
router.use("/user", userRouter);
