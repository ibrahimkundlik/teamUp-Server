import express from "express";
import auth from "../middleware/auth.js";
import { getTeams, createTeam } from "../controllers/team.controllers.js";

const router = express.Router();

router.get("/", auth, getTeams);
router.post("/", auth, createTeam);

export default router;
