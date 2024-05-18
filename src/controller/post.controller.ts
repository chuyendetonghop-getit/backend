import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import {
  CreatePostInput,
  DeletePostInput,
  GetListPostsInput,
  GetPostByIdInput,
  UpdatePostInput,
} from "../schema/post.schema";
import {
  createPost,
  deletePost,
  findPost,
  getListPosts,
  updatePost,
} from "../service/post.service";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";

export async function createPostHandler(
  req: Request<{}, {}, CreatePostInput["body"]>,
  res: Response
) {
  try {
    const post = await createPost(req.body);

    return sendSuccessResponse(
      res,
      post,
      HttpStatusCode.Created,
      "Create post success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function getListPostHandler(
  req: Request<GetListPostsInput["query"]>,
  res: Response
) {
  // console.log("this is head ***", req.query);
  try {
    // TODO: temporary solution fix type issue with req.query
    const posts = await getListPosts(req.query as GetListPostsInput["query"]);

    return sendSuccessResponse(
      res,
      posts,
      HttpStatusCode.Ok,
      "Get all posts success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function getPostByIdHandler(
  req: Request<GetPostByIdInput["params"], {}, {}>,
  res: Response
) {
  try {
    const postId = req.params.id;
    const post = await findPost({ _id: postId });

    if (!post?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "Post not found");
    }

    return sendSuccessResponse(
      res,
      post,
      HttpStatusCode.Ok,
      "Get user success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function updatePostHandler(
  req: Request<UpdatePostInput["params"], {}, UpdatePostInput["body"]>,
  res: Response
) {
  try {
    const postId = req.params.id;
    const post = await findPost({ _id: postId });

    if (!post?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "Post not found");
    }

    const updatedData = req.body;

    const updateResult = await updatePost({ _id: postId }, updatedData, {
      new: true,
    });

    return sendSuccessResponse(
      res,
      updateResult,
      HttpStatusCode.Ok,
      "Update post success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function deletePostHandler(
  req: Request<DeletePostInput["params"], {}, {}>,
  res: Response
) {
  try {
    const postId = req.params.id;
    const post = await findPost({ _id: postId });

    if (!post?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "Post not found");
    }

    const deleteResult = await deletePost({ _id: postId });

    return sendSuccessResponse(
      res,
      deleteResult,
      HttpStatusCode.Ok,
      "Delete post success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
