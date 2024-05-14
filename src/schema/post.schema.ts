import { TypeOf, number, object, string } from "zod";

const categorySchema = object({
  cat_id: string(),
  cat_image: string(),
  cat_name: string(),
  cat_icon: string(),
  position: number(),
});

const statusSchema = object({
  id: string(),
  name: string(),
  name_en: string(),
  description: string(),
});

const locationSchema = object({
  type: string(),
  coordinates: number().array(),
  lat: string(),
  lon: string(),
  displayName: string(),
});

const payload = {
  body: object({
    location: locationSchema,
    category: categorySchema,
    images: string({
      required_error: "Images is required",
    }).array(),
    title: string({
      required_error: "Title is required",
    }),
    price: string({
      required_error: "Price is required",
    }),
    status: statusSchema,
    description: string({
      required_error: "Description is required",
    }).min(20, "Description should be at least 20 characters long"),
    phone: string({
      required_error: "Phone is required",
    }),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "postId is required",
    }),
  }),
};

export const createPostSchema = object({
  ...payload,
});

export const updatePostSchema = object({
  ...{
    body: payload.body.partial(),
  },
  ...params,
});

export const deletePostSchema = object({
  ...params,
});

export const getPostSchema = object({
  ...params,
});

export const getListPostsSchema = object({
  query: object({
    limit: string({
      required_error: "Limit is required",
    }).optional(),
    page: string({
      required_error: "Page is required",
    }).optional(),
    lat: string({
      required_error: "Latitude is required",
    }).optional(),
    long: string({
      required_error: "Longitude is required",
    }).optional(),
    radius: string({
      required_error: "Radius is required",
    }).optional(),
    title: string({
      required_error: "Title is required",
    }).optional(),
    description: string({
      required_error: "Description is required",
    }).optional(),
    category: string({
      required_error: "Category is required",
    }).optional(),
    status: string({
      required_error: "Status is required",
    }).optional(),
  }),
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type GetPostByIdInput = TypeOf<typeof getPostSchema>;
export type GetListPostsInput = TypeOf<typeof getListPostsSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>;
