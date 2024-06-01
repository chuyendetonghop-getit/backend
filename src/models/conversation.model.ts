// conversation.model.ts
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ConversationInput {
  postId: string;
  participants: string[];
  lastMessage?: {
    sender: string;
    text: string;
    createdAt: Date;
  };
}

export interface ConversationDocument
  extends ConversationInput,
    mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    // Optional: Last message details for quick overview
    // In case of initial message, lastMessage will be null
    lastMessage: {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ConversationSchema.plugin(mongoosePaginate);

const ConversationModel = mongoose.model<
  ConversationDocument,
  mongoose.PaginateModel<ConversationDocument>
>("Conversation", ConversationSchema);

export default ConversationModel;
