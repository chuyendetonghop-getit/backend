// socket.controller.ts

import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ESocketEvents } from "../constant/enum";
import {
  joinConversation,
  leaveConversation,
  sendMessage,
} from "../service/socket.service";
import { TChatSendMessage } from "../types/socket.type";

export async function socketListener(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  //  start listening to socket events

  io.on(ESocketEvents.CONNECTION, (socket) => {
    // console.info("A user connected ->", socket.id);

    const user = socket.user;
    console.log(" <-🤝->", user?.name, "|", user._id);

    // -----------------------------------------------
    // join chat room event
    socket.on(
      ESocketEvents.CHAT_JOIN_CONVERSATION,
      (data: { postId: string; receiverId: string }) => {
        joinConversation({
          io,
          socket,
          postId: data.postId,
          participants: {
            senderId: user?._id,
            receiverId: data.receiverId,
          },
        });
      }
    );

    // -----------------------------------------------
    // leave chat room event
    socket.on(ESocketEvents.CHAT_LEAVE_CONVERSATION, () => {
      leaveConversation({
        io,
        socket,
      });
    });

    // -----------------------------------------------
    // send message event
    socket.on(
      ESocketEvents.CHAT_SEND_MESSAGE,
      ({ originId, text, image }: TChatSendMessage) => {
        sendMessage({
          io,
          socket,
          originId,
          text,
          image,
        });
      }
    );

    // -----------------------------------------------
    // subscribe conversation changes event
    socket.on(ESocketEvents.CHAT_SUBSCRIBE_CONVERSATION_CHANGE, () => {
      const userId = user?._id;

      console.log("subscribe conversation changes", userId);

      socket.join(userId);
    });

    // -----------------------------------------------
    // unsubscribe to conversation changes event
    socket.on(ESocketEvents.CHAT_UNSUBSCRIBE_CONVERSATION_CHANGE, () => {
      const userId = user?._id;

      console.log("Unsubscribe to conversation changes", userId);

      socket.leave(userId);
    });

    // -----------------------------------------------
    // disconnect event
    socket.on(ESocketEvents.DISCONNECT, () => {
      console.error(`IO_DISCONNECT::: ${user?.name} ---*--- ${user?._id} ->`);
    });
  });

  io.engine.on(ESocketEvents.CONNECTION_ERROR, (err) => {
    console.log("connection_error CODE:", err.code);
    console.log("connection_error MESSAGE:", err.message);
  });
}
