import User from "../models/user.models.js";
import Team from "../models/team.models.js";

export const getTeams = async (req, res) => {
	try {
		const { teams } = await User.findById(req.userId).populate({
			path: "teams",
			populate: {
				path: "members._id",
				model: "users",
				select: "name",
			},
		});

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
		const { name, members, description } = req.body;
		let newTeam = await Team.create({
			name,
			members,
			description,
		});

		newTeam = await newTeam
			.populate({
				path: "members._id",
				model: "users",
				select: "name",
			})
			.execPopulate();

		members.map(async (member) => {
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
