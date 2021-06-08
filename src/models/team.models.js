import mongoose from "mongoose";
import { reqString, memberSchema, activitySchema } from "./utils.schemas.js";

const teamSchema = mongoose.Schema(
	{
		name: reqString,
		description: reqString,
		members: {
			type: [memberSchema],
			required: true,
			default: [],
		},
		tasks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "tasks",
			},
		],
		activity: {
			type: [activitySchema],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const Team = mongoose.model("teams", teamSchema);

export default Team;
