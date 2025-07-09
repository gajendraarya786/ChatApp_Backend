import { Router } from "express";
import { register, login } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)
router.route("/login").post(login)


router.get("/profile", verifyJWT, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;