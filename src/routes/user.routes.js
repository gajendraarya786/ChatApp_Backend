import { Router } from "express";
import { register, login, logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)


router.get("/profile", verifyJWT, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;