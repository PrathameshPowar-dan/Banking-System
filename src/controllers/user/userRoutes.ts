import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "./user.controller";
import { AuthToken } from "../../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", AuthToken, getUserProfile);

export default router;