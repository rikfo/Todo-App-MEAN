import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "the task must have a name"],
  },
  isFinished: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    select: false,
  },
});

taskSchema.pre("save", function (next) {
  this.populate({
    path: "user",
    select: "email",
  });
  next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email",
  });
  next();
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
