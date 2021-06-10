import express from "express";
import auth from "../middleware/auth.js";
import {
	getTeams,
	createTeam,
	searchTeam,
} from "../controllers/team.controllers.js";

const router = express.Router();

router.get("/", auth, getTeams);
router.post("/", auth, createTeam);
router.get("/search", auth, searchTeam);

export default router;
