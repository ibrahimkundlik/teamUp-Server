import express from "express";
import auth from "../middleware/auth.js";
import { login, signup, joinRequest } from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.patch("/request/:id", auth, joinRequest);

export default router;
