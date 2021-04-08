import mongoose from "mongoose";
// const dotenv = require("dotenv");
import dotenv from "dotenv";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "../../backEnd/config.env" });

import app from "../../backEnd/app.js";

const dataBase = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(dataBase, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("your connection was successful!");
  });

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("App runing on port :" + port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
