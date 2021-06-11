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
		const teamName = `${name[0].toUpperCase() + name.substring(1)}`;

		let newTeam = await Team.create({
			name: teamName,
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
				{ new: true, runValidators: true }
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

export const searchTeam = async (req, res) => {
	try {
		const query = req.query.searchQuery.trim();

		if (query.length === 0) {
			return res.status(400).json({
				error: "/errors/teams",
				message:
					"Kindly check your search query. The provided search query is empty.",
			});
		}

		const result = await Team.find({
			name: { $regex: query, $options: "i" },
		}).select("name members");

		res.status(200).json({ result });
	} catch (error) {
		res.status(500).json({
			error: "/errors/teams",
			message: "Something went wrong while searching teams.",
			codeMessage: error.message,
		});
	}
};
