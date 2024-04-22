import { object, string, TypeOf } from "zod";

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
    }),
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
