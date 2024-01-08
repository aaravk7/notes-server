import mongoose, { ObjectId } from "mongoose";

const Schema = mongoose.Schema;

export interface ITask {
  userId: ObjectId;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "done";
}

const taskSchema = new Schema<ITask>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: {
    type: String,
    enum: ["todo", "inprogress", "done"],
    default: "todo"
  }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
