import { Response } from "express";
import { FilterQuery, UpdateQuery } from "mongoose";

import Task, { ITask } from "../models/task";
import { AuthenticatedRequest } from "../types";
import { isValidStatus, isValidString } from "../utils";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, status } = req.query;
    let filter: FilterQuery<ITask> = { userId: req.userId };
    if (typeof query === "string") {
      filter = { ...filter, $or: [{ title: new RegExp(query, "i") }, { description: new RegExp(query, "i") }] };
    }
    if (status && isValidStatus(status)) {
      filter.status = status;
    }
    const tasks = await Task.find(filter);
    return res.json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const addTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;
    if (!isValidString(title, 3) || !isValidString(description, 5) || !isValidStatus(status)) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const newTask = new Task({ userId: req.userId, description, title, status });
    await newTask.save();
    return res.json({ task: newTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, status } = req.body;

    const updates: UpdateQuery<ITask> = {};
    if (title) {
      if (!isValidString(title, 3)) return res.status(400).json({ error: "Invalid input" });
      updates.title = title;
    }
    if (description) {
      if (!isValidString(description, 5)) return res.status(400).json({ error: "Invalid input" });
      updates.description = description;
    }
    if (status) {
      if (!isValidStatus(status)) return res.status(400).json({ error: "Invalid input" });
      updates.status = status;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params._id, userId: req.userId },
      { $set: updates },
      { new: true }
    );
    return res.json({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const response = await Task.deleteOne({ _id: req.params._id, userId: req.userId });
    return res.json({ response });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
