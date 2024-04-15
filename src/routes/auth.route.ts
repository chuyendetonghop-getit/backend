import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "./../schema/auth.schema";
// authRouter.ts
import express from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  signupHandler,
} from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { loginSchema } from "../schema/auth.schema";
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

router.post("/login", validateResource(loginSchema), loginHandler);

router.post("/signup", validateResource(createUserSchema), signupHandler);

router.post("/logout", (req, res) => {
  // Logic để đăng xuất người dùng
});

router.post(
  "/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
);

export default router;
