import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export type IoSocket = {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
};

// Two ways to define a conversation
// 1. Define a conversation by postId and participants
// 2. Define a conversation by conversationId

export type TChatJoinConversation = {
  postId: string;
  participants: [string, string];
};

export type TSocketJoinConversation = IoSocket & TChatJoinConversation;

export type TSocketLeaveConversation = IoSocket;

export type TChatSendMessage = {
  originId: string;
  text?: string;
  media?: string[];
};

export type TSocketSendMessage = IoSocket & TChatSendMessage;
