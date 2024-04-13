// Auth controller

import { Request, Response } from "express";
import { login } from "../service/auth.service";
import logger from "../utils/logger";
import { LoginInput } from "../schema/auth.schema";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";

export async function loginHandler(
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response
) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    return res.json(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).json({
      success: false,
      message: e.message,
    });
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
