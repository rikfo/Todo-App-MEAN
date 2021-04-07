import Task from "../models/taskModel.js";
import { catchAsync } from "../utils/catchAsync.js";

import express from "express";

const router = express.Router();

router.post(
  "/add-task",
  catchAsync(async (req, res) => {
    const task = await Task.create({
      name: req.body.name,
      isFinished: req.body.isFinished,
      user: req.user._id,
    });

    res.status(200).json({
      status: "success",
      task,
    });
  })
);

router.get("/", async (req, res) => {
  const userId = req.user._id;

  try {
    const tasks = await Task.find({ user: { _id: userId } });

    res.status(200).json({
      results: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

router.patch("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(201).json({
      task,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/task/:id", async (req, res) => {
  try {
    await Task.findByIdAndRemove(req.params.id);

    res.status(200).json({
      message: "removed",
    });
  } catch (err) {
    console.log("noice");
  }
});

export default router;
