import mongoose, { FilterQuery, PaginateOptions, QueryOptions } from "mongoose";

import PostModel, { PostDocument } from "../models/post.model";
import {
  CreatePostInput,
  GetListPostsAdminInput,
  GetListPostsInput,
} from "../schema/post.schema";

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

export async function findMyPost(query: FilterQuery<PostDocument>) {
  const { limit = 10, page = 1, userId } = query;

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    sort: { createdAt: "desc" },
    lean: true,
    forceCountFn: true,
  };

  return PostModel.paginate(
    {
      userId,
    },
    options
  );
}

export async function aggregatePost(query: FilterQuery<PostDocument>) {
  return await PostModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(query._id),
      },
    }, // Lọc các bài post dựa trên điều kiện truy vấn
    {
      $lookup: {
        from: "users", // Tên của bảng users trong MongoDB
        localField: "userId", // Trường trong bảng Post mà bạn muốn sử dụng để join với userId trong bảng Users
        foreignField: "_id", // Trường trong bảng Users mà bạn muốn sử dụng để join với localField trong bảng Post
        as: "author", // Tên của trường chứa thông tin người dùng sau khi join
      },
    },
    {
      $project: {
        "author.password": 0,
        // "author.createdAt": 0,
        "author.updatedAt": 0,
        "author.geoLocation": 0,
        "author.role": 0,
        "author.verify": 0,
      },
    },
  ]);
}

export async function updatePost(
  query: FilterQuery<PostDocument>,
  update: Partial<PostDocument>,
  config?: QueryOptions
) {
  return PostModel.findOneAndUpdate(query, update, config);
}

export async function getListPosts(input: GetListPostsInput["query"]) {
  const {
    limit = 10,
    page = 1,
    title,
    description,
    categoryId,
    statusId,
    lat,
    lon,
    radius,
  } = input;

  // console.log("this is head ***", lat, lon, radius);

  // const query: FilterQuery<PostDocument> = {};

  // if (title || description) {
  //   query.$or = [];
  //   if (title) {
  //     query.$or.push({ title: { $regex: new RegExp(`.*${title}.*`, "i") } });
  //   }
  //   if (description) {
  //     query.$or.push({
  //       description: { $regex: new RegExp(`.*${description}.*`) },
  //     });
  //   }
  // }

  // if (categoryId) {
  //   query["category.cat_id"] = categoryId;
  // }

  // if (statusId) {
  //   query["status.status_id"] = statusId;
  // }

  // if (lat && lon && radius) {
  //   query.location = {
  //     $geoWithin: {
  //       $centerSphere: [
  //         [parseFloat(lon), parseFloat(lat)],
  //         Number(radius) / 6378.1,
  //       ],
  //     },
  //   };
  // }

  // console.log("Q -<", query);
  const findQuery: FilterQuery<PostDocument> = {
    location: {
      $geoWithin: {
        $centerSphere: [
          [parseFloat(lon), parseFloat(lat)],
          parseFloat(radius) / 6378.1,
        ], // radius in kilometers
      },
    },
  };

  // Additional filters
  if (title) findQuery.title = { $regex: title, $options: "i" };
  if (description)
    findQuery.description = { $regex: description, $options: "i" };
  if (categoryId) findQuery["category.cat_id"] = categoryId;
  if (statusId) findQuery["status.id"] = statusId;

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    sort: { createdAt: "desc" },
    lean: true,
    // forceCountFn: true is required to get total count on all documents while using $geoWithin in mongoose-paginate-v2
    forceCountFn: true,
  };

  return PostModel.paginate(findQuery, options);
}

export async function deletePost(query: FilterQuery<PostDocument>) {
  return PostModel.deleteOne(query);
}

// get all posts by admin
export async function getPostsByAdmin(input: GetListPostsAdminInput["query"]) {
  const { limit = 10, page = 1, search } = input;

  const query: FilterQuery<PostDocument> = {};

  if (search) {
    query.$or = [];

    query.$or.push({ title: { $regex: new RegExp(`.*${search}.*`, "i") } });
    query.$or.push({
      description: { $regex: new RegExp(`.*${search}.*`, "i") },
    });

    // why this query below not working? i just test it by query with a phone number

    query.$or.push({
      "category.cat_name": { $regex: new RegExp(`.*${search}.*`, "i") },
    });

    query.$or.push({
      "status.name": { $regex: new RegExp(`.*${search}.*`, "i") },
    });

    query.$or.push({
      phone: { $regex: new RegExp(`.*${search}.*`, "i") },
    });

    // query.$or.push({
    //   "location.displayName": { $regex: new RegExp(`.*${search}.*`, "i") },
    // });
  }

  const options: PaginateOptions = {
    limit: +limit,
    page: +page,
    sort: { createdAt: "desc" },
    lean: true,
    forceCountFn: true,
  };

  return PostModel.paginate(query, options);
}
