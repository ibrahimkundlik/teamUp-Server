import mongoose from "mongoose";

const teamSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		members: {
			type: [mongoose.Schema.Types.ObjectId],
			default: [],
		},
		tasks: {
			type: [mongoose.Schema.Types.Mixed],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
