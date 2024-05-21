// post.route.ts
import express from "express";

import {
  createPostHandler,
  deletePostHandler,
  getListPostHandler,
  getMyPostsHandler,
  getPostByAdminHandler,
  getPostByIdHandler,
  updatePostHandler,
} from "../controller/post.controller";
import validateResource from "../middleware/validateResource";
import {
  createPostSchema,
  deletePostSchema,
  getListPostsAdminSchema,
  getListPostsSchema,
  getMyPostsSchema,
  getPostSchema,
  updatePostSchema,
} from "../schema/post.schema";

const router = express.Router();

router.post("/", validateResource(createPostSchema), createPostHandler);

router.get("/", validateResource(getListPostsSchema), getListPostHandler);

router.get("/me", validateResource(getMyPostsSchema), getMyPostsHandler);

// admin routes
router.get(
  "/admin",
  validateResource(getListPostsAdminSchema),
  getPostByAdminHandler
);

router.get("/:id", validateResource(getPostSchema), getPostByIdHandler);

router.put("/:id", validateResource(updatePostSchema), updatePostHandler);

router.delete("/:id", validateResource(deletePostSchema), deletePostHandler);

export default router;
