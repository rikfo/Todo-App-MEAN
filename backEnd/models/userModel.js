// const mongoose = require("mongoose");
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "the user must have a email"],
    unique: [true, "there is already a user with that email!"],
  },
  password: {
    type: String,
    required: [true, "password required "],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirming password is required!"],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: `the password confirmation isn't correct!`,
    },
  },
  tasks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Task",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //encrypting the password the higher the salt value is, the higher cpu work
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, async function (next) {});

userSchema.methods.checkPassword = async function (candPW, usrPW) {
  // this.password is not available because it's not selected
  return await bcrypt.compare(candPW, usrPW);
};

const User = mongoose.model("User", userSchema);

export default User;
