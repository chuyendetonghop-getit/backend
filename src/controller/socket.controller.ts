// socket.controller.ts

import { Server } from "socket.io";
import { SocketWithUser } from "../types/socket.type";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export async function socketListener(
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  //  start listening to socket events

  io.on("connection", (socket) => {
    console.info(" 🌟 A user connected ->", socket.id);

    const user = (socket as SocketWithUser).user;

    console.log("user ->", user?.name);

    socket.on("disconnect", () => {
      console.error(" 💫 A user disconnected ->", socket.id);
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log("connection_error CODE:", err.code);
    console.log("connection_error MESSAGE:", err.message);
  });
}
