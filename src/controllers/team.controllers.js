import User from "../models/user.models.js";
import Team from "../models/team.models.js";

export const getTeams = async (req, res) => {
	try {
		const { teams } = await User.findById(req.userId)
			.populate({
				path: "teams",
				model: "teams",
			})
			.select("teams");

		res.status(200).json({ teams });
	} catch (error) {
		res.status(500).json({
			error: "/errors/teams",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
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
				member._id,
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
