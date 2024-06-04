import { FilterQuery, PaginateOptions } from "mongoose";

import ConversationModel, {
  ConversationDocument,
} from "../models/conversation.model";
import { GetListConversationInput } from "../schema/conversation.schema";
import { GetMessageByConversationIdInput } from "../schema/message.schema";
import MessageModel from "../models/message.model";

export async function getMessagesByConversationId(
  conversationId: string,
  input: GetMessageByConversationIdInput["query"]
) {
  const { limit = 10, page = 1 } = input;

  const query: FilterQuery<ConversationDocument> = {
    conversationId: conversationId,
  };

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    // sort by latest message
    sort: { createdAt: "desc" },
    lean: true,
  };

  return MessageModel.paginate(query, options);
}
