// user.route.ts
import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createUserSchema,
  deleteUserByIdSchema,
  getListUsersSchema,
  getUserByIdSchema,
  updateUserByIdSchema,
} from "../schema/user.schema";
import {
  deleteUserHandler,
  getListUserHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "../controller/user.controller";

const router = express.Router();

router.get("/", validateResource(getListUsersSchema), getListUserHandler);

router.get("/:id", validateResource(getUserByIdSchema), getUserByIdHandler);

router.put("/:id", validateResource(updateUserByIdSchema), updateUserHandler);

router.delete(
  "/:id",
  validateResource(deleteUserByIdSchema),
  deleteUserHandler
);

export default router;
