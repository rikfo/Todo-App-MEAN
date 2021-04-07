import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// router.use("/login", (req, res) => {});
router.route("/login").post(authController.login);
router.route("/signUp").post(authController.signUp);

export default router;
