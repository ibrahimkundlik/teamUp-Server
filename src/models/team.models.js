import mongoose from "mongoose";
import {
	reqString,
	memberSchema,
	taskSchema,
	activitySchema,
} from "./team.schemas.js";

const teamSchema = mongoose.Schema(
	{
		name: reqString,
		members: {
			type: [memberSchema],
			required: true,
			default: [],
		},
		tasks: {
			type: [taskSchema],
			default: [],
		},
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
