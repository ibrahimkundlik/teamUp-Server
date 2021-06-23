export const getTasks = async (req, res) => {
	try {
	} catch (error) {}
};

export const createTask = async (req, res) => {
	try {
		const files = req.files;
		res.status(201).json({ files });
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
