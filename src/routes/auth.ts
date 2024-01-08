import express from "express";

import { getUser, login, register } from "../controllers/authController";
import isLoggedIn from "../middlewares/isLoggedIn";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/", isLoggedIn, getUser);

export default authRouter;
