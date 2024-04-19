import { object, string, TypeOf } from "zod";

export const createTokenSchema = object({
  body: object({
    userId: string({
      required_error: "User ID is required",
    }),
    otpVerify: string({
      required_error: "otpVerify is required",
    }).optional(),
    otpVerifyExpireAt: string({
      required_error: "otpVerifyExpireAt is required",
    }).optional(),
    otpReset: string({
      required_error: "otpReset is required",
    }).optional(),
    otpResetExpireAt: string({
      required_error: "otpResetExpireAt is required",
    }).optional(),
  }),
});

export const resendOTPSchema = object({
  body: object({
    userId: string({
      required_error: "User ID is required",
    }),
    resendType: string({
      required_error: "Resend Type is required",
    }),
  }),
});

export const verifySignUpSchema = object({
  body: object({
    userId: string({
      required_error: "User ID is required",
    }),
    otpVerify: string({
      required_error: "otpVerify is required",
    }),
  }),
});

export const verifyForgotPasswordSchema = object({
  body: object({
    userId: string({
      required_error: "User ID is required",
    }),
    otpReset: string({
      required_error: "otpReset is required",
    }),
  }),
});

export type CreateTokenInput = Omit<
  TypeOf<typeof createTokenSchema>,
  "body.passwordConfirmation"
>;

export type VerifyTokenSignupInput = TypeOf<typeof verifySignUpSchema>;
export type resendOTPInput = TypeOf<typeof resendOTPSchema>;
export type VerifyTokenForgotPasswordInput = TypeOf<
  typeof verifyForgotPasswordSchema
>;
