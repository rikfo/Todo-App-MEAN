{
  // import { promisify } from "util";
  // import jwt from "jsonwebtoken";
  // import crypto from "crypto";
  // // const crypto = require('crypto');
  // exports.protect = catchAsync(async (req, res, next) => {
  //   // 1) get the token and check if it exists
  //   // console.log('nooooo noooo noooo');
  //   // return next(new ErrorHandler('lmeeeeeeeeeeeeeeeeerd', 400));
  //   let token;
  //   if (
  //     req.headers.authorization &&
  //     req.headers.authorization.startsWith("Bearer")
  //   )
  //     token = req.headers.authorization.split(" ")[1];
  //   else if (req.cookies.jwt) token = req.cookies.jwt;
  //   if (!token) {
  //     return next(new ErrorHandler("you are not logged in!", 401));
  //   }
  //   // 2) token verification
  //   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   // 3) check if user still exists
  //   const freshUser = await User.findById(decoded.id);
  //   if (!freshUser) return next(new ErrorHandler("the user no longer exist"));
  //   // 4) check if user changed password after token was issued
  //   if (freshUser.changedPWAfter(decoded.iat)) {
  //     return next(
  //       new ErrorHandler(
  //         "user recently changed password! please login again!",
  //         401
  //       )
  //     );
  //   }
  //   //GRANT ACCESS TO PROTECTED ROUTES
  //   req.user = freshUser;
  //   res.locals.user = freshUser; // every template will have access to this
  //   next();
  // });
}
import jwt from "jsonwebtoken";
// import crypto from "crypto";
import { promisify } from "util";

import User from "../models/userModel.js";
import { catchAsync } from "../utils/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const exprDate = process.env.JWT_EXPIRES_IN;

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true, // https
    httpOnly: true, // cookie can not be accessed or modified by the browser
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // removing the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    experationDate: exprDate,
    data: {
      user,
    },
  });
};

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide an email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new ErrorHandler("Email or password is incorrect!", 400));
  }

  createSendToken(user, 200, res);
});

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new Email(newUser, url).sendWelcome();
  // res.status(201).json({
  //   status: "success",
  //   message: "user created successfully",
  // });

  createSendToken(newUser, 201, res);
});

const protect = catchAsync(async (req, res, next) => {
  // 1) get the token and check if it exists
  // console.log('nooooo noooo noooo');
  // return next(new ErrorHandler('lmeeeeeeeeeeeeeeeeerd', 400));
  // console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }
  // console.log(token);
  //  else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  //   console.log(token);
  // }

  if (!token) {
    return next(new ErrorHandler("you are not logged in!", 401));
  }

  // 2) token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) return next(new ErrorHandler("the user no longer exist"));
  // 4) check if user changed password after token was issued
  // if (freshUser..changedPWAfter(decoded.iat)) {
  //   return next(
  //     new ErrorHandler(
  //       "user recently changed password! please login again!",
  //       401
  //     )
  //   );
  // }

  //GRANT ACCESS TO PROTECTED ROUTES
  req.user = freshUser;
  res.locals.user = freshUser; // every template will have access to this
  next();
});

export default { login, signUp, protect };
// export default login;
