import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import authRouter from "./routes/auth";
import taskRouter from "./routes/tasks";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s4u5dhc.mongodb.net/tasks-app`)
  .then(() => console.log("Connected to Database."))
  .catch((err) => console.error("Could not connect to database.", err));

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
