export enum EUserRoles {
  ADMIN = "admin",
  USER = "user",
}

export enum ETokenTypes {
  OTP_VERIFY = "otpVerify",
  OTP_RESET = "otpReset",
}

export enum ESocketEvents {
  CONNECTION = "connection",
  DISCONNECT = "disconnect",
  CONNECTION_ERROR = "connection_error",
  CHAT_JOIN_CONVERSATION = "chatJoinConversation",
  CHAT_LEAVE_CONVERSATION = "chatLeaveConversation",
  CHAT_SEND_MESSAGE = "chatSendMessage",
  CHAT_RECEIVE_MESSAGE = "chatReceiveMessage",
}
