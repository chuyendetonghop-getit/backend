// message.route.ts

import express from "express";
import validateResource from "../middleware/validateResource";
import { getMessageByConversationIdSchema } from "../schema/message.schema";
import { getMessageByConversationIdHandler } from "../controller/message.controller";

const router = express.Router();

router.get(
  "/:conversationId",
  validateResource(getMessageByConversationIdSchema),
  getMessageByConversationIdHandler
);

export default router;
