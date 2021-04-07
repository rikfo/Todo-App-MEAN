import path from "path";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import usersRouter from "./routes/usersRouter.js";
import tasksRouter from "./routes/tasksRouter.js";
import ErrorHandler from "./utils/errorHandler.js";
import errorController from "./controllers/errorController.js";
import authController from "./controllers/authController.js";

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

if (process.env.NODE_ENV === "production") {
  console.log(path.join(path.resolve(), "/dist/front-end"));
  console.log(path.resolve(path.resolve(), "dist", "front-end", "index.html"));
  app.use(express.static(path.join(path.resolve(), "/dist/front-end")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(path.resolve(), "dist", "front-end", "index.html")
    );
  });
} else {
  app.all("*", (req, res, next) => {
    next(new ErrorHandler("cannot find this route on this server!", 404));
  });
}

app.use(errorController);

export default app;
