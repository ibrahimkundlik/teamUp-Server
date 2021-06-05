import User from "../models/user.models.js";
import Team from "../models/team.models.js";

export const getTeams = async (req, res) => {
	try {
		res.status(200).json({ team: "getTeams" });
	} catch (error) {}
};

export const createTeam = async (req, res) => {
	try {
		const { name, members } = req.body;
		const newTeam = await Team.create({
			name,
			members,
		});
		newTeam.members.map(async (member) => {
			await User.findByIdAndUpdate(
				member.memberId,
				{ $push: { teams: newTeam._id } },
				{ upsert: true, new: true }
			);
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
