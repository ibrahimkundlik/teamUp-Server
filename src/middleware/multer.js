import multer from "multer";

const multerUpload = multer({
	dest: "uploads/",
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/gi)) {
			return cb(new Error("Please upload jpg or jpeg or png images!"));
		}
		cb(null, true);
	},
});

const upload = multerUpload.array("attachments", 5);

const uploadFunction = (req, res, next) => {
	upload(req, res, (error) => {
		if (error) {
			return res.status(400).json({
				error: "/errors/upload",
				message: "Invalid Upload",
				codeMessage: error.message,
			});
		} else {
			next();
		}
	});
};

export default uploadFunction;
