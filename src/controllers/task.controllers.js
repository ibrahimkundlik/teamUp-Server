import { uploadFileToS3, getSignedS3url } from "../utils/aws-s3.js";
import fs from "fs";
import util from "util";
import Task from "../models/task.models.js";
import Team from "../models/team.models.js";

const unlinkFile = util.promisify(fs.unlink);

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
		const { name, type, priority, assigned, description, teamId } = JSON.parse(
			req.body.taskData
		);

		if (name.trim().length === 0 || description.trim().length === 0) {
			return res.status(400).json({
				error: "/errors/tasks",
				message: "Kindly check your task data. The provided data is empty.",
			});
		}

		const newTask = await Task.create({
			name,
			type,
			priority,
			assigned,
			description,
			attachments,
		});
		const updatedTeam = await Team.findByIdAndUpdate(
			teamId,
			{ $push: { tasks: newTask._id } },
			{ new: true, runValidators: true }
		);

		res.status(201).json({ task: newTask, teamId: updatedTeam._id });
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

export const getTaskImages = (req, res) => {
	try {
		const fileKey = req.params.key;
		const readStream = getSignedS3url(fileKey);
		readStream.pipe(res);
	} catch (error) {
		res.status(500).json({
			error: "/errors/images",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};
