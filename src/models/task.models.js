import mongoose from "mongoose";
import { reqString, commentSchema } from "./utils.schemas.js";

const taskSchema = mongoose.Schema(
	{
		name: { ...reqString, trim: true },
		type: reqString,
		priority: reqString,
		assigned: {
			type: [
				{
					username: reqString,
					userId: {
						type: mongoose.Schema.Types.ObjectId,
					},
				},
			],
			required: true,
		},
		description: { ...reqString, trim: true },
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
