import { SocketWithUser } from "../types/socket.type";
import { verifyJwt } from "../utils/jwt.utils";

// TODO: fix any type in socket middleware
export default function socketMiddleware(socket: any, next: any) {
  const headerToken = socket.handshake.headers.authorization;

  if (!headerToken) {
    return next(new Error("Missing Bearer Authentication in extraHeaders"));
  }

  const token = headerToken?.split(" ")[1];
  if (!token) {
    return next(new Error("Invalid token format"));
  }

  // check token
  const { valid, expired, decoded } = verifyJwt(token);
  // console.log("decoded ->", decoded);

  if (!valid || expired) {
    return next(new Error("Invalid or Expired after check token"));
  }

  // add user to socket
  (socket as SocketWithUser).user = decoded;

  next();
}
