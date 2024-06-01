import { FilterQuery, PaginateOptions } from "mongoose";

import ConversationModel, {
  ConversationDocument,
} from "../models/conversation.model";
import { GetListConversationInput } from "../schema/conversation.schema";

export async function getListConversations(
  userId: string,
  input: GetListConversationInput["query"]
) {
  const { limit = 10, page = 1 } = input;

  const query: FilterQuery<ConversationDocument> = {
    // query for conversation where user is a participant
    participants: { $in: [userId] },
  };

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    // sort by latest conversation
    sort: { updatedAt: "desc" },
    lean: true,
  };

  return ConversationModel.paginate(query, options);
}

export async function getDetailConversation(conversationId: string) {
  return ConversationModel.findOne({ _id: conversationId })
    .populate("postId")
    .lean();
}
