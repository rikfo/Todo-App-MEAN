import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/signUp").post(authController.signUp);

export default router;
