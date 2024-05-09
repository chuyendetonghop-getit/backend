import { FilterQuery, PaginateOptions } from "mongoose";

import PostModel, { PostDocument } from "../models/post.model";
import { CreatePostInput, GetListPostsInput } from "../schema/post.schema";

export async function createPost(input: CreatePostInput["body"]) {
  try {
    const Post = await PostModel.create(input);
    return Post;
  } catch (error) {
    throw new Error("Error when create post");
  }
}

export async function findPost(query: FilterQuery<PostDocument>) {
  return PostModel.findOne(query).lean();
}

export async function updatePost(
  query: FilterQuery<PostDocument>,
  update: Partial<PostDocument>,
  config?: UpdatePostOptions
) {
  return PostModel.findOneAndUpdate(query, update, config);
}

export async function getListPosts(input: GetListPostsInput["query"]) {
  const { limit = 10, page = 1, title, description, category, status } = input;

  const query: FilterQuery<PostDocument> = {};

  if (title || description) {
    query.$or = [];
    if (title) {
      query.$or.push({ title: { $regex: new RegExp(`.*${title}.*`, "i") } });
    }
    if (description) {
      query.$or.push({
        description: { $regex: new RegExp(`.*${description}.*`) },
      });
    }
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    sort: { createdAt: "desc" },
  };

  return PostModel.paginate(query, options);
}

export async function deletePost(query: FilterQuery<PostDocument>) {
  return PostModel.deleteOne(query);
}
