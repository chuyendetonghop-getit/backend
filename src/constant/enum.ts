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
  // event for changing conversation in chat screen
  CHAT_SUBSCRIBE_CONVERSATION_CHANGE = "chatSubscribeConversationChange",
  CHAT_UNSUBSCRIBE_CONVERSATION_CHANGE = "chatUnsubscribeConversationChange",
  CHAT_CONVERSATION_CHANGE = "chatConversationChange",
}

// enum for report post
export enum EReportReasonTypes {
  FRAUD = "fraud",
  DUPLICATE = "duplicate",
  ITEM_SOLD = "itemSold",
  UNABLE_TO_CONTACT = "unableToContact",
  INACCURATE_CONTENT = "inaccurateContent",
  COUNTERFEIT_GOODS = "counterfeitGoods",
  ITEM_DAMAGED_AFTER_PURCHASE = "itemDamagedAfterPurchase",
}
