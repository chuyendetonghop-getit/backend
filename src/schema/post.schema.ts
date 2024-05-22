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
  query: object({
    lat: string({
      required_error: "Latitude is required",
    }),
    lon: string({
      required_error: "Longitude is required",
    }),
  }),
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
    }),
    lon: string({
      required_error: "Longitude is required",
    }),
    radius: string({
      required_error: "Radius is required",
    }),
    title: string({
      required_error: "Title is required",
    }).optional(),
    description: string({
      required_error: "Description is required",
    }).optional(),
    categoryId: string({
      required_error: "CategoryId is required",
    }).optional(),
    statusId: string({
      required_error: "StatusId is required",
    }).optional(),
  }),
});

export const getMyPostsSchema = object({
  query: object({
    userId: string({
      required_error: "UserId is required",
    }),
    limit: string({
      required_error: "Limit is required",
    }).optional(),
    page: string({
      required_error: "Page is required",
    }).optional(),
  }),
});

export const getListPostsAdminSchema = object({
  query: object({
    limit: string({
      required_error: "Limit is required",
    }).optional(),
    page: string({
      required_error: "Page is required",
    }).optional(),
    search: string({
      required_error: "Search is required",
    }).optional(),
  }),
});

export type CreatePostInput = TypeOf<typeof createPostSchema>;
export type UpdatePostInput = TypeOf<typeof updatePostSchema>;
export type GetPostByIdInput = TypeOf<typeof getPostSchema>;
export type GetListPostsInput = TypeOf<typeof getListPostsSchema>;
export type DeletePostInput = TypeOf<typeof deletePostSchema>;
export type GetMyPostsInput = TypeOf<typeof getMyPostsSchema>;
export type GetListPostsAdminInput = TypeOf<typeof getListPostsAdminSchema>;
