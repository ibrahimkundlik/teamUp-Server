import mongoose from "mongoose";
import { reqString, commentSchema } from "./utils.schemas.js";

const taskSchema = mongoose.Schema(
	{
		name: reqString,
		type: reqString,
		difficulty: reqString,
		assigned: {
			type: [mongoose.Schema.Types.ObjectId],
			required: true,
		},
		description: reqString,
		comments: {
			type: [commentSchema],
			default: [],
		},
		attachments: [String],
	},
	{
		timestamps: true,
	}
);

const Task = mongoose.model("tasks", taskSchema);

export default Task;
