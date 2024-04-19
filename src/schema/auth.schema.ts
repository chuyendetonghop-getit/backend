// Auth schema

import { object, string, TypeOf } from "zod";

export const loginSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - should be 6 chars minimum"),
    phone: string({
      required_error: "Phone is required",
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    phone: string({
      required_error: "Phone is required",
    }),
  }),
});

export const updatePasswordSchema = object({
  body: object({
    phone: string({
      required_error: "Phone is required",
    }),
    newPassword: string({
      required_error: "New password is required",
    }),
  }),
});

export type LoginInput = TypeOf<typeof loginSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = TypeOf<typeof updatePasswordSchema>;
