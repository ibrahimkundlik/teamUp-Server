import mongoose from "mongoose";

export const reqString = {
	type: String,
	required: true,
};

export const commentSchema = mongoose.Schema(
	{
		ownerId: {
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

export const joinRequestSchema = mongoose.Schema({
	userName: reqString,
	teamName: reqString,
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	teamId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

export const activitySchema = mongoose.Schema(
	{
		ownerId: {
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
