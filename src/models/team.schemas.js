import mongoose from "mongoose";

export const reqString = {
	type: String,
	required: true,
};

export const commentSchema = mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		message: reqString,
	},
	{
		timestamps: true,
	}
);

export const memberSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "users",
	},
	level: reqString,
});

export const taskSchema = mongoose.Schema({
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
});

export const activitySchema = mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		action: reqString,
		taskId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
