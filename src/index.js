import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import teamRoutes from "./routes/team.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
	res.send("teamUp server is running :)");
});

const PORT = process.env.PORT;

mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => {
			console.log(`Server is up on port ${PORT}`);
		})
	)
	.catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);
