import express from "express";
// import Task from "./models/taskModel.js";
import usersRouter from "./routes/usersRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
// import { catchAsync } from "./utils/catchAsync.js";
import ErrorHandler from "./utils/errorHandler.js";
import errorController from "./controllers/errorController.js";
import authController from "./controllers/authController.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/", usersRouter);

app.use("/tasks", cors({ origin: "*" }), authController.protect, tasksRouter);

app.all("*", (req, res, next) => {
  next(new ErrorHandler("cannot find this route on this server!", 404));
});

app.use(errorController);

export default app;
