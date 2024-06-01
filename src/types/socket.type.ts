import { Socket } from "socket.io";

export interface SocketWithUser extends Socket {
  // TODO: define user type
  user: any;
}
