// message.model.ts
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface MessageInput {
  conversationId: string;
  senderId: string;
  text?: string;
  image?: string;
}

export interface MessageDocument extends MessageInput, mongoose.Document {
  originalId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema(
  {
    originId: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: { type: String },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MessageSchema.plugin(mongoosePaginate);
// Message Model
const MessageModel = mongoose.model<
  MessageDocument,
  mongoose.PaginateModel<MessageDocument>
>("Message", MessageSchema);

export default MessageModel;
