import { uploadFileToS3, getSingedUrl } from "../utils/aws-s3.js";
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
		const { type, priority, assigned, taskId } = req.body;
		const updatedTask = await Task.findByIdAndUpdate(
			taskId,
			{
				type,
				priority,
				$addToSet: { assigned },
			},
			{ new: true, runValidators: true }
		);
		res.status(200).json({ task: updatedTask });
	} catch (error) {
		res.status(500).json({
			error: "/errors/tasks",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};

export const getTaskImages = async (req, res) => {
	try {
		const { attachments } = req.body;
		const signedURLs = [];
		attachments.map((key) => {
			signedURLs.push(getSingedUrl(key));
		});
		res.status(200).json({ signedURLs });
	} catch (error) {
		res.status(500).json({
			error: "/errors/attachments",
			message: "Something went wrong.",
			codeMessage: error.message,
		});
	}
};
