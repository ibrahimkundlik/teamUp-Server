import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/user.models.js";

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
				expiresIn: "1h",
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
		const fullname = `${firstname.trim()} ${lastname.trim()}`;
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
				expiresIn: "1h",
			}
		);
		res.status(200).json({ user: newUser, token });
	} catch (error) {
		res.status(500).json({
			error: "/errors/signup",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};
