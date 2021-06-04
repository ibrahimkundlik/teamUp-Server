import mongoose from "mongoose";
import Team from "../models/team.models.js";

export const getTeams = async (req, res) => {
	try {
		res.status(200).json({ team: "getTeams" });
	} catch (error) {}
};

export const createTeam = async (req, res) => {
	try {
		const { name, memberID } = req.body;
		const newTeam = await Team.create({
			name,
			members: [mongoose.Types.ObjectId(memberID)],
		});
		res.status(200).json({ team: newTeam });
	} catch (error) {
		res.status(500).json({
			error: "/errors/teams",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const updateTeam = async (req, res) => {
	try {
		res.status(200).json({ team: "updateTeam" });
	} catch (error) {}
};
