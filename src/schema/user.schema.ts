import { number, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    phone: string({
      required_error: "Phone number is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
  }),
});

export const getListUsersSchema = object({
  query: object({
    limit: string({
      required_error: "Limit is required",
    }).optional(),
    page: string({
      required_error: "Page is required",
    }).optional(),
    name: string({
      required_error: "Name is required",
    }).optional(),
    phone: string({
      required_error: "Phone is required",
    }).optional(),
  }),
});

export const getUserByIdSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
});

export const updateUserByIdSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
  body: object({
    name: string({
      required_error: "Name is required",
    }).optional(),
    avatar: string({
      required_error: "Avatar is required",
    }).optional(),
    geoLocation: object({
      location: object({
        type: string({
          required_error: "Type is required",
        }),
        coordinates: number({
          required_error: "Coordinates is required",
        }).array(),
        lat: string({
          required_error: "Latitude is required",
        }),
        lon: string({
          required_error: "Longitude is required",
        }),
        displayName: string({
          required_error: "Display name is required",
        }),
      }),
      radius: number({
        required_error: "Radius is required",
      }),
    }).optional(),
  }),
});

export const deleteUserByIdSchema = object({
  params: object({
    id: string({
      required_error: "User ID is required",
    }),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type GetListUserInput = TypeOf<typeof getListUsersSchema>;
export type GetUserByIdInput = TypeOf<typeof getUserByIdSchema>;
export type UpdateUserByIdInput = TypeOf<typeof updateUserByIdSchema>;
export type DeleteUserByIdInput = TypeOf<typeof deleteUserByIdSchema>;
