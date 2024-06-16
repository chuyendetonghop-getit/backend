// user.route.ts
import express from "express";

import {
  getUserByIdHandler,
  updateUserHandler,
} from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { getUserByIdSchema, updateUserByIdSchema } from "../schema/user.schema";

const router = express.Router();

router.get("/:id", validateResource(getUserByIdSchema), getUserByIdHandler);

router.put("/:id", validateResource(updateUserByIdSchema), updateUserHandler);

export default router;
