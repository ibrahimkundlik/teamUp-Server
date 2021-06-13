import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user.models.js";
import Team from "../models/team.models.js";

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		//check user
		const checkUser = await User.findOne({ email });
		if (!checkUser) {
			return res.status(400).json({
				error: "/errors/login",
				message: "Kindly check your email and password.",
			});
		}
		//check password
		const checkPassword = await bcrypt.compare(password, checkUser.password);
		if (!checkPassword) {
			return res.status(400).json({
				error: "/errors/login",
				message: "Kindly check your email and password.",
			});
		}
		//start login
		const token = jwt.sign(
			{
				email: checkUser.name,
				id: checkUser._id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "10 days",
			}
		);
		res.status(200).json({ user: checkUser, token });
	} catch (error) {
		res.status(500).json({
			error: "/errors/signup",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const signup = async (req, res) => {
	try {
		const { firstname, lastname, email, password, confirmPassword } = req.body;
		//check email
		if (!validator.isEmail(email)) {
			return res.status(400).json({
				error: "/errors/signup",
				message: "Kindly enter a valid email address.",
			});
		}
		//check user email already exist
		const checkUser = await User.findOne({ email });
		if (checkUser) {
			return res.status(400).json({
				error: "/errors/signup",
				message:
					"This email address is already being used. Kindly register with another email.",
			});
		}
		//check password
		if (password !== confirmPassword) {
			return res.status(400).json({
				error: "/errors/signup",
				message: "Passwords don't match. Kindly re-enter your both passwords.",
			});
		}
		if (password.length < 8) {
			return res.status(400).json({
				error: "/errors/signup",
				message:
					"Password length is too small. Kindly re-enter your both passwords with minimum length of 8 characters.",
			});
		}

		let fname = firstname.trim();
		let lname = lastname.trim();
		const fullname = `${
			fname[0].toUpperCase() + fname.substring(1).toLowerCase()
		} ${lname[0].toUpperCase() + lname.substring(1).toLowerCase()}`;

		//start signup
		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			name: fullname,
			email,
			password: hashedPassword,
		});
		const token = jwt.sign(
			{
				email: newUser.name,
				id: newUser._id,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "10 days",
			}
		);
		res.status(200).json({ user: newUser, token });
	} catch (error) {
		res.status(500).json({
			error: "/errors/request",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const joinRequest = async (req, res) => {
	try {
		const { userName, teamName, teamId } = req.body;
		const userId = req.userId;
		const adminId = req.params.id;

		//socket

		const updatedAdmin = await User.findByIdAndUpdate(
			adminId,
			{ $addToSet: { joinRequests: { userName, teamName, userId, teamId } } },
			{ new: true, runValidators: true }
		);

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $addToSet: { sentRequests: teamId } },
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			user: updatedUser.sentRequests,
			admin: updatedAdmin.joinRequests,
		});
	} catch (error) {
		res.status(500).json({
			error: "/errors/signup",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const addMember = async (req, res) => {
	try {
		const { userId, teamId, requestId, type } = req.body;
		const adminId = req.userId;

		//socket

		const updatedAdmin = await User.findByIdAndUpdate(
			adminId,
			{ $pull: { joinRequests: { _id: requestId } } },
			{ new: true, runValidators: true }
		);

		if (type === "reject") {
			const rejectUser = await User.findByIdAndUpdate(
				userId,
				{ $pull: { sentRequests: teamId } },
				{ new: true, runValidators: true }
			);

			return res.status(200).json({
				admin: updatedAdmin.joinRequests,
				user: rejectUser.sentRequests,
			});
		} else if (type === "accept") {
			const acceptUser = await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { teams: teamId }, $pull: { sentRequests: teamId } },
				{ new: true, runValidators: true }
			);

			const updatedTeam = await Team.findByIdAndUpdate(
				teamId,
				{ $addToSet: { members: { _id: userId, level: "member" } } },
				{ new: true, runValidators: true }
			).populate({
				path: "members._id",
				model: "users",
				select: "name",
			});

			return res.status(200).json({
				admin: updatedAdmin.joinRequests,
				user: acceptUser.sentRequests,
				team: updatedTeam.members,
			});
		} else {
			return res.status(400).json({
				error: "/errors/add-member",
				message: "Something went wrong. Invalid data sent.",
			});
		}
	} catch (error) {
		res.status(500).json({
			error: "/errors/add-member",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};
