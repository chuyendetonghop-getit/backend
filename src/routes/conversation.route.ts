// conversation.route.ts

import express from "express";
import { getListConversationHandler } from "../controller/conversation.controller";
import validateResource from "../middleware/validateResource";
import { getListConversationSchema } from "../schema/conversation.schema";

const router = express.Router();

router.get(
  "/",
  validateResource(getListConversationSchema),
  getListConversationHandler
);

export default router;
