// validate token in request header
import { NextFunction, Request, Response } from "express";

import logger from "../utils/logger";
import { verifyJwt } from "../utils/jwt.utils";
import { UserDocument } from "../models/user.model";

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.sendStatus(401);
  }

  try {
    const { valid, expired, decoded } = await verifyJwt(accessToken as string);
    if (!valid || expired) {
      return res.sendStatus(401);
    }
    res.locals.user = decoded as UserDocument;
    next();
  } catch (error) {
    logger.error(error);
    return res.sendStatus(401);
  }
};

export default validateToken;
