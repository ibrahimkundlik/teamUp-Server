import express from "express";
import auth from "../middleware/auth.js";
import {
	login,
	signup,
	joinRequest,
	addMember,
	addMemberByEmail,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.patch("/request/:id", auth, joinRequest);
router.patch("/add-member", auth, addMember);
router.patch("/add-member-by-email", auth, addMemberByEmail);

export default router;
