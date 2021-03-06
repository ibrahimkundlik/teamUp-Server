import mongoose from "mongoose";
import { reqString, joinRequestSchema } from "./utils.schemas.js";

const userSchema = mongoose.Schema(
	{
		name: reqString,
		email: {
			...reqString,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			...reqString,
			trim: true,
			minLength: 8,
		},
		teams: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "teams",
			},
		],
		joinRequests: {
			type: [joinRequestSchema],
			default: [],
		},
		sentRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "teams",
			},
		],
	},
	{
		timestamps: true,
	}
);

//deleting password before sending the response
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

const User = mongoose.model("users", userSchema);

export default User;
