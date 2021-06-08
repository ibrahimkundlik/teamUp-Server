import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		if (token) {
			const decodedData = jwt.verify(token, process.env.JWT_SECRET);
			req.userId = decodedData?.id;
		}
		next();
	} catch (error) {
		res.status(403).json({
			error: "/errors/auth",
			message: "Authorization Error",
			codeMessage: error.message,
		});
	}
};

export default auth;
