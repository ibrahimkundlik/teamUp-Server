import mongoose from "mongoose";

const reqString = {
	type: String,
	required: true,
};

const memberSchema = mongoose.Schema({
	memberId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	level: reqString,
});

const teamSchema = mongoose.Schema(
	{
		name: reqString,
		members: {
			type: [memberSchema],
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

const Team = mongoose.model("teams", teamSchema);

export default Team;
