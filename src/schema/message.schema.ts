import { TypeOf, object, string } from "zod";

const params = {
  params: object({
    receiverId: string({
      required_error: "receiverId is required",
    }),
    postId: string({
      required_error: "postId is required",
    }),
  }),
};

const query = {
  query: object({
    limit: string({
      required_error: "Limit is required",
    }).optional(),
    page: string({
      required_error: "Page is required",
    }).optional(),
  }),
};

export const getMessageByConversationIdSchema = object({
  ...params,
  ...query,
});

export type GetMessageByConversationIdInput = TypeOf<
  typeof getMessageByConversationIdSchema
>;
