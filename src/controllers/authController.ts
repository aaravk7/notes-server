import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { AuthenticatedRequest } from "../types";
import { isValidEmail, isValidString } from "../utils";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!isValidEmail(email) || !isValidString(password, 8) || !isValidString(name, 3)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "A user with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hash
    });
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: "15d" });
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email) || !isValidString(password, 8)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Please enter valid credentials." });
    }

    const pass = bcrypt.compareSync(req.body.password, user.password);
    if (!pass) {
      return res.status(400).json({ error: "Please enter valid credentials." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET as string);
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
