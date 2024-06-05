// socket.service.ts
import { ESocketEvents } from "../constant/enum";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import {
  TSocketJoinConversation,
  TSocketLeaveConversation,
  TSocketSendMessage,
} from "./../types/socket.type";

export async function joinConversation({
  io,
  socket,
  postId,
  participants,
}: TSocketJoinConversation) {
  console.log(
    "joinConversation",
    postId,
    participants[0],
    "<| |>",
    participants[1]
  );
  // 1. check if conversation already exists
  const existedConversation = await ConversationModel.findOne({
    postId,
    participants: { $all: participants },
  });
  console.log("this existedConversation =>", existedConversation);

  if (existedConversation) {
    // 2a.1 - join the conversation
    console.log("conversation already exists");
    socket.join(existedConversation._id.toString());

    // 2a.2 - assign the conversation id to the socket
    socket.conversationId = existedConversation._id.toString();

    // 2a.3 - emit a ping message to the conversation room
    // io.to(existedConversation._id.toString()).emit(
    //   ESocketEvents.CHAT_RECEIVE_MESSAGE,
    //   `Hello from server in existed conversation ${existedConversation._id.toString()}`
    // );
  } else {
    // if not create a new conversation
    console.log("creating new conversation");
    const newConversation = new ConversationModel({
      postId,
      participants,
    });
    await newConversation.save();
    // 2b.1 - join the conversation
    socket.join(newConversation._id.toString());

    // 2b.2 - assign the conversation id to the socket
    socket.conversationId = newConversation._id.toString();

    // 2b.3 - emit a ping message to the conversation room
    // io.to(newConversation._id.toString()).emit(
    //   ESocketEvents.CHAT_RECEIVE_MESSAGE,
    //   `Hello from server in new conversation ${newConversation._id.toString()}`
    // );
  }
}

// ---------------------------------------------------------

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
}

// ---------------------------------------------------------

export async function sendMessage({
  io,
  socket,
  originId,
  text,
  image,
}: TSocketSendMessage) {
  // 1. get conversation id from the socket
  const conversationId = socket.conversationId;
  console.log("-> save message to conversation ID:::", conversationId);

  if (!conversationId) {
    return;
  }
  console.log("originId:::", originId);

  // 2. save the message to the database
  const newMessage = new MessageModel({
    originId,
    conversationId,
    senderId: socket.user?._id,
    text,
    image,
  });

  await newMessage.save();

  // 3 assign this message to "lastMessage" property in the conversation model with conversationId
  await ConversationModel.findByIdAndUpdate(
    { _id: conversationId },
    {
      lastMessage: {
        text: Boolean(text) || !Boolean(image) ? text : "[Hình ảnh]",
        senderId: socket.user?._id,
      },
    }
    // {
    //   new: true,
    //   useFindAndModify: false,
    // }
  );

  // 4. emit the message to the conversation room
  // change from "io" to "socket" to emit to other users in the same conversation except the sender
  socket
    .to(conversationId)
    .emit(ESocketEvents.CHAT_RECEIVE_MESSAGE, newMessage);
  console.log("sendMessage:::", text);
}
