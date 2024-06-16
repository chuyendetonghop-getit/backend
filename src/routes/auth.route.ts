import express from "express";

import {
  forgotPasswordHandler,
  loginHandler,
  resendOTPHandler,
  signupHandler,
  updatePasswordHandler,
  verifyForgotPasswordHandler,
  verifySignupHandler,
} from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { loginSchema } from "../schema/auth.schema";
import {
  resendOTPSchema,
  verifyForgotPasswordSchema,
  verifySignUpSchema,
} from "../schema/token.schema";
import { createUserSchema } from "../schema/user.schema";
import {
  forgotPasswordSchema,
  updatePasswordSchema,
} from "./../schema/auth.schema";

const router = express.Router();

router.post("/login", validateResource(loginSchema), loginHandler);
router.post("/signup", validateResource(createUserSchema), signupHandler);
router.post("/resend-otp", validateResource(resendOTPSchema), resendOTPHandler);
router.post(
  "/verify-signup",
  validateResource(verifySignUpSchema),
  verifySignupHandler
);
router.post(
  "/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);
router.post(
  "/verify-forgot-password",
  validateResource(verifyForgotPasswordSchema),
  verifyForgotPasswordHandler
);
router.post(
  "/update-password",
  validateResource(updatePasswordSchema),
  updatePasswordHandler
);

export default router;
