import express from "express";
import auth from "../middleware/auth.js";
import {
	createTask,
	updateTask,
	getTaskImages,
} from "../controllers/task.controllers.js";
import uploadFunction from "../middleware/multer.js";

const router = express.Router();

router.post("/create", [auth, uploadFunction], createTask);
router.patch("/update", auth, updateTask);
router.get("/images/:key", getTaskImages);

export default router;
