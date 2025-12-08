import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.registerUser);
router.post("/signin", authController.loginUser);

export const authRoutes = router;