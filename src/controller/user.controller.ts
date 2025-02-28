import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { GetUserByIdInput, UpdateUserByIdInput } from "../schema/user.schema";
import { findUser, updateUser } from "../service/user.service";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";

export async function getUserByIdHandler(
  req: Request<GetUserByIdInput["params"], {}, {}>,
  res: Response
) {
  try {
    const userId = req.params.id;
    const user = await findUser({ _id: userId });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }
    return sendSuccessResponse(
      res,
      user,
      HttpStatusCode.Ok,
      "Get user success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function updateUserHandler(
  req: Request<UpdateUserByIdInput["params"], {}, UpdateUserByIdInput["body"]>,
  res: Response
) {
  try {
    const userId = req.params.id;
    const user = await findUser({ _id: userId });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }
    const updatedData = req.body;
    const updateResult = await updateUser({ _id: user._id }, updatedData, {
      new: true,
    });
    return sendSuccessResponse(
      res,
      updateResult,
      HttpStatusCode.Ok,
      "Update user success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
