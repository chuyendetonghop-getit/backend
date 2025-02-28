// conversation.controller.ts

import { HttpStatusCode } from "axios";
import { Request, Response } from "express";
import { cloneDeep } from "lodash";
import { UserDocument } from "../models/user.model";
import { GetListConversationInput } from "../schema/conversation.schema";
import { getListConversations } from "../service/conversation.service";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";

export async function getListConversationHandler(
  req: Request<{}, {}, {}, GetListConversationInput["query"]>,
  res: Response
) {
  const user = res.locals.user;
  try {
    const paginatedConversations = await getListConversations(
      user?._id,
      req.query as GetListConversationInput["query"]
    );
    const tmpConversation = cloneDeep(paginatedConversations);
    const cloneDocs = tmpConversation.docs.map((conversation) => {
      const partner = conversation.participantsDetail.find(
        (participant: UserDocument) =>
          participant._id.toString() !== user?._id.toString()
      );
      delete conversation.participantsDetail;
      return {
        ...conversation,
        post: conversation.post[0],
        partner: partner,
      };
    });
    const finalConversations = {
      ...tmpConversation,
      docs: cloneDocs,
    };
    return sendSuccessResponse(
      res,
      finalConversations,
      HttpStatusCode.Ok,
      "Get all conversations success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
