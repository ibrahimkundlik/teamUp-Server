import { uploadFileToS3 } from "../utils/aws-s3.js";

export const getTasks = async (req, res) => {
	try {
	} catch (error) {}
};

export const createTask = async (req, res) => {
	try {
		const files = req.files;

		const S3Promises = files.map(async (file) => {
			const S3Response = await uploadFileToS3(file);
			return S3Response.key;
		});

		const result = await Promise.all(S3Promises);

		res.status(201).json({ files, result });
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
	} catch (error) {}
};
