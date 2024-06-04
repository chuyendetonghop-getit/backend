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
import { cloneDeep } from "lodash";
import { UserDocument } from "../models/user.model";

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

    // console.log("paginatedConversations", paginatedConversations);
    const tmpConversation = cloneDeep(paginatedConversations);

    const cloneDocs = tmpConversation.docs.map((conversation) => {
      const partner = conversation.participantsDetail.find(
        (participant: UserDocument) =>
          participant._id.toString() !== user?._id.toString()
      );

      // delete unnecessary fields
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

    const conversations = (await getDetailConversation(id)) as any[];
    console.log("conversation", conversations);

    if (conversations.length === 0) {
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "Conversation not found"
      );
    }

    const thisConversation = conversations[0];

    const cloneConversation = cloneDeep(thisConversation) as any;
    const partner = cloneConversation.participantsDetail.find(
      (participant: UserDocument) =>
        participant._id.toString() !== res.locals.user?._id.toString()
    );

    cloneConversation.partner = partner;
    cloneConversation.post = cloneConversation.post[0];

    // delete unnecessary fields
    delete cloneConversation.participantsDetail;

    return sendSuccessResponse(
      res,
      cloneConversation,
      HttpStatusCode.Ok,
      "Get post by id success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
