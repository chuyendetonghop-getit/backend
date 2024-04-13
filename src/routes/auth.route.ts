// authRouter.ts
import express from "express";
import { loginHandler, signupHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResource";
import { loginSchema } from "../schema/auth.schema";
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

// Route để đăng nhập
router.post("/login", validateResource(loginSchema), loginHandler);

// Route để đăng ky
router.post("/signup", validateResource(createUserSchema), signupHandler);

// Route để đăng xuất
router.post("/logout", (req, res) => {
  // Logic để đăng xuất người dùng
});

// Route để cập nhật mật khẩu
router.put("/password", (req, res) => {
  // Logic để cập nhật mật khẩu của người dùng
});

export default router;
