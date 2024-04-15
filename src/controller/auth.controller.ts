// Auth controller

import { Request, Response } from "express";
import { login } from "../service/auth.service";
import logger from "../utils/logger";
import { ForgotPasswordInput, LoginInput } from "../schema/auth.schema";
import { CreateUserInput } from "../schema/user.schema";
import { createUser, findUser } from "../service/user.service";
import { sendEmail } from "../service/email.service";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";
import { HttpStatusCode } from "axios";

export async function loginHandler(
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    // return res.json(user);
    return sendSuccessResponse(res, user, HttpStatusCode.Ok, "Login success");
  } catch (e: any) {
    logger.error(e);
    // return res.status(404).json({
    //   success: false,
    //   message: e.message,
    // });
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function signupHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const user = await createUser(req.body);
    return res.jsonp(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).json({
      success: false,
      message: e.message,
    });
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput["body"]>,
  res: Response
) {
  try {
    const { email } = req.body;

    const userOrNot = await findUser({ email });

    if (!userOrNot) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Gửi email chứa link reset password
    const mailResult = await sendEmail(
      email,
      "Reset password",
      `This is your code to reset your password ${Math.floor(
        Math.random() * 1000000
      )}`
    );

    return res.json({
      success: true,
      message: "Forgot password success",
    });
  } catch (e: any) {
    logger.error(e);
    return res.status(409).json({
      success: false,
      message: e.message,
    });
  }
}
