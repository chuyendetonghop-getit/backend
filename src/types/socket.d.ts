// First import the original Socket
import { Socket } from "socket.io";
import { UserDocument } from "../models/user.model";

// Extend the interface
declare module "socket.io" {
  interface Socket {
    user: UserDocument;
    conversationId: string | null;
    receiverId: string | null;
  }
}
