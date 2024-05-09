// post.route.ts
import express from "express";

import {
  createPostHandler,
  deletePostHandler,
  getListPostHandler,
  getPostByIdHandler,
  updatePostHandler,
} from "../controller/post.controller";
import validateResource from "../middleware/validateResource";
import {
  createPostSchema,
  deletePostSchema,
  getListPostsSchema,
  getPostSchema,
  updatePostSchema,
} from "../schema/post.schema";

const router = express.Router();

router.post("/", validateResource(createPostSchema), createPostHandler);

router.get("/", validateResource(getListPostsSchema), getListPostHandler);

router.get("/:id", validateResource(getPostSchema), getPostByIdHandler);

router.put("/:id", validateResource(updatePostSchema), updatePostHandler);

router.delete("/:id", validateResource(deletePostSchema), deletePostHandler);

export default router;
