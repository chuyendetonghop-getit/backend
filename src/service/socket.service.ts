// socket.service.ts
import { ESocketEvents } from "../constant/enum";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import {
  TSocketJoinConversation,
  TSocketLeaveConversation,
  TSocketSendMessage,
} from "./../types/socket.type";

// Socket service
export async function joinConversation({
  io,
  socket,
  postId,
  participants,
}: TSocketJoinConversation) {
  socket.receiverId = participants.receiverId;
  const existedConversation = await ConversationModel.findOne({
    postId,
    participants: { $all: [participants.senderId, participants.receiverId] },
  });
  if (existedConversation) {
    socket.join(existedConversation._id.toString());
    socket.conversationId = existedConversation._id.toString();
  } else {
    const newConversation = new ConversationModel({
      postId,
      participants: [participants.senderId, participants.receiverId],
    });
    await newConversation.save();
    socket.join(newConversation._id.toString());
    socket.conversationId = newConversation._id.toString();
  }
}

export async function leaveConversation({
  io,
  socket,
}: TSocketLeaveConversation) {
  // 1. get conversation id from the socket
  const conversationId = socket.conversationId;
  console.log("->leaveConversationID", conversationId);

  if (!conversationId) {
    return;
  }

  // 2. leave the conversation
  console.log("leaving ............!");
  socket.leave(conversationId);

  // 3. assign null to the conversation id in the socket
  socket.conversationId = null;
  console.log("after leaving |=> assigning conversationId to null");

  // 4. assign null to the receiverId in the socket
  socket.receiverId = null;
  console.log("after leaving |=> assigning receiverId to null");
}

// Socket service
export async function sendMessage({
  io,
  socket,
  originId,
  text,
  image,
}: TSocketSendMessage) {
  const conversationId = socket.conversationId;
  if (!conversationId) {
    return;
  }
  const newMessage = new MessageModel({
    originId,
    conversationId,
    senderId: socket.user?._id,
    text,
    image,
  });
  await newMessage.save();
  await ConversationModel.findByIdAndUpdate(
    { _id: conversationId },
    {
      lastMessage: {
        text: Boolean(text) || !Boolean(image) ? text : "[Hình ảnh]",
        senderId: socket.user?._id,
      },
    }
  );
  socket
    .to(conversationId)
    .emit(ESocketEvents.CHAT_RECEIVE_MESSAGE, newMessage);
  if (!socket.receiverId) {
    return;
  }
  socket.to(socket.receiverId).emit(ESocketEvents.CHAT_CONVERSATION_CHANGE);
}
