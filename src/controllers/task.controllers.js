import { uploadFileToS3 } from "../utils/aws-s3.js";
import fs from "fs";
import util from "util";
import Task from "../models/task.models.js";
import Team from "../models/team.models.js";

const unlinkFile = util.promisify(fs.unlink);

export const getTasks = async (req, res) => {
	try {
	} catch (error) {}
};

export const createTask = async (req, res) => {
	try {
		//file upload to S3
		const files = req.files;
		const S3Promises = files.map(async (file) => {
			const S3Response = await uploadFileToS3(file);
			await unlinkFile(file.path);
			return S3Response.key;
		});
		const attachments = await Promise.all(S3Promises);

		//getting other task data
		const { name, type, difficulty, assigned, description, teamId } =
			JSON.parse(req.body.data);
		let newTask = await Task.create({
			name,
			type,
			difficulty,
			assigned,
			description,
			attachments,
		});

		const updatedTeam = await Team.findByIdAndUpdate(
			teamId,
			{ $push: { tasks: newTask._id } },
			{ new: true, runValidators: true }
		);

		res.status(201).json({ task: newTask, team: updatedTeam });
	} catch (error) {
		res.status(500).json({
			error: "/errors/tasks",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const updateTask = async (req, res) => {
	try {
	} catch (error) {}
};
