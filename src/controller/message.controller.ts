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
import { GetMessageByConversationIdInput } from "../schema/message.schema";
import { getMessagesByConversationId } from "../service/message.service";

export async function getMessageByConversationIdHandler(
  req: Request<
    GetMessageByConversationIdInput["params"],
    {},
    {},
    GetMessageByConversationIdInput["query"]
  >,
  res: Response
) {
  try {
    const userId = res.locals.user?._id;

    const { receiverId, postId } = req.params;
    const { page, limit } = req.query;

    const conversation = await getDetailConversation({
      userId,
      receiverId,
      postId,
    });

    const thisConversation = conversation[0];

    const paginatedMessages = await getMessagesByConversationId(
      thisConversation._id,
      {
        page,
        limit,
      }
    );

    return sendSuccessResponse(
      res,
      paginatedMessages,
      HttpStatusCode.Ok,
      "Get messages by conversation ID success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
