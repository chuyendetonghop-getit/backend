import ConversationModel from "../models/conversation.model";

const ObjectId = require("mongoose").Types.ObjectId;

export const listConversation = (_id: string) => [
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        participants: {
          $in: [new ObjectId(_id)],
        },
      },
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "post",
      },
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participantsDetail",
      },
  },
];

export const detailConversation = (
  userId: string,
  receiverId: string,
  postId: string
) => [
  {
    $match: {
      participants: {
        $in: [new ObjectId(userId), new ObjectId(receiverId)],
      },
      postId: new ObjectId(postId),
    },
  },
  {
    $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
      {
        from: "posts",
        localField: "postId",
        foreignField: "_id",
        as: "post",
      },
  },
  {
    $lookup: {
      from: "users",
      localField: "participants",
      foreignField: "_id",
      as: "participantsDetail",
    },
  },
];
