import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { cloneDeep } from "lodash";
import PostModel from "../models/post.model";
import {
  CreatePostInput,
  DeletePostInput,
  GetListPostsAdminInput,
  GetListPostsInput,
  GetMyPostsInput,
  GetPostByIdInput,
  UpdatePostInput,
} from "../schema/post.schema";
import {
  aggregatePost,
  deletePost,
  findMyPost,
  findPost,
  getListPosts,
  getPostsByAdmin,
  updatePost,
} from "../service/post.service";
import { calculateDistance } from "../utils/location";
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
    const input = req.body;
    const Post = await PostModel.create(input);
    return sendSuccessResponse(
      res,
      Post,
      HttpStatusCode.Created,
      "Create post success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function getListPostHandler(
  req: Request<{}, {}, {}, GetListPostsInput["query"]>,
  res: Response
) {
  try {
    const paginatedPosts = await getListPosts(
      req.query as GetListPostsInput["query"]
    );
    const clonePaginatedPosts = cloneDeep(paginatedPosts);
    const insertedDistancePostsDocs = clonePaginatedPosts?.docs.map(
      (post: any) => {
        const distance = calculateDistance(
          parseFloat(req.query.lat),
          parseFloat(req.query.lon),
          post.location.coordinates[1],
          post.location.coordinates[0]
        );
        post.distance = distance;
        return post;
      }
    );
    clonePaginatedPosts.docs = insertedDistancePostsDocs;
    return sendSuccessResponse(
      res,
      clonePaginatedPosts,
      HttpStatusCode.Ok,
      "Get all posts success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function getPostByIdHandler(
  req: Request<GetPostByIdInput["params"], {}, {}, GetPostByIdInput["query"]>,
  // req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { lat, lon } = req.query;

    console.log("postId", id, lat, lon);
    const posts = await aggregatePost({ _id: id });

    const targetPost = posts[0];

    if (!targetPost?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "Post not found");
    }

    const clonePost = cloneDeep(targetPost);

    clonePost.author = clonePost.author[0];

    const distance = calculateDistance(
      parseFloat(lat),
      parseFloat(lon),
      clonePost.location.coordinates[1],
      clonePost.location.coordinates[0]
    );

    // console.log("distance", distance);

    clonePost.distance = distance;

    return sendSuccessResponse(
      res,
      clonePost,
      HttpStatusCode.Ok,
      "Get post by id success"
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

export async function getMyPostsHandler(
  req: Request<{}, {}, {}, GetMyPostsInput["query"]>,
  res: Response
) {
  try {
    const paginatedPosts = await findMyPost(req.query);

    return sendSuccessResponse(
      res,
      paginatedPosts,
      HttpStatusCode.Ok,
      "Get my posts success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

// get post by admin handler
export async function getPostByAdminHandler(
  req: Request<{}, {}, {}, GetListPostsAdminInput["query"]>,
  res: Response
) {
  try {
    const paginatedPosts = await getPostsByAdmin(req.query);

    return sendSuccessResponse(
      res,
      paginatedPosts,
      HttpStatusCode.Ok,
      "Get all posts success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
