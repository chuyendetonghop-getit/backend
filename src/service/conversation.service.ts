import { PaginateOptions } from "mongoose";

import ConversationModel from "../models/conversation.model";
import { GetListConversationInput } from "../schema/conversation.schema";
import { detailConversation, listConversation } from "../utils/mongoose";

export async function getListConversations(
  userId: string,
  input: GetListConversationInput["query"]
) {
  const { limit = 10, page = 1 } = input;

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    // sort by latest conversation
    sort: { updatedAt: -1 },
    // lean: true,
    // pagination: true,
  };

  const aggregate = listConversation(userId);

  const listConversationAggregate = ConversationModel.aggregate(aggregate);

  return ConversationModel.aggregatePaginate(
    listConversationAggregate,
    options
  );
}

export async function getDetailConversation(conversationId: string) {
  return ConversationModel.aggregate(detailConversation(conversationId));
}
