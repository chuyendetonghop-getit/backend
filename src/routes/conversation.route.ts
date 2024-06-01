// conversation.route.ts

import express from "express";
import validateResource from "../middleware/validateResource";
import {
  getConversationSchema,
  getListConversationSchema,
} from "../schema/conversation.schema";
import {
  getConversationByIdHandler,
  getListConversationHandler,
} from "../controller/conversation.controller";

const router = express.Router();

router.get(
  "/",
  validateResource(getListConversationSchema),
  getListConversationHandler
);

router.get(
  "/:id",
  validateResource(getConversationSchema),
  getConversationByIdHandler
);

export default router;
