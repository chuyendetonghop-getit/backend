// conversation.controller.ts

import { Request, Response } from "express";
import {
  GetConversationInput,
  GetListConversationInput,
} from "../schema/conversation.schema";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";
import { HttpStatusCode } from "axios";
import logger from "../utils/logger";
import {
  getDetailConversation,
  getListConversations,
} from "../service/conversation.service";

export async function getListConversationHandler(
  req: Request<{}, {}, {}, GetListConversationInput["query"]>,
  res: Response
) {
  const user = res.locals.user;
  try {
    // TODO: temporary solution fix type issue with req.query
    const paginatedConversations = await getListConversations(
      user?._id,
      req.query as GetListConversationInput["query"]
    );

    return sendSuccessResponse(
      res,
      paginatedConversations,
      HttpStatusCode.Ok,
      "Get all conversations success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function getConversationByIdHandler(
  req: Request<
    GetConversationInput["params"],
    {},
    {},
    // GetConversationInput["query"]
    {}
  >,
  // req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    // const { page, limit } = req.query;

    console.log("conversationId", id);
    const post = await getDetailConversation(id);

    if (!post) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "Post not found");
    }

    return sendSuccessResponse(
      res,
      post,
      HttpStatusCode.Ok,
      "Get post by id success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
