// user.route.ts
import express from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/session.schema";
import { createUserSchema } from "../schema/user.schema";

const router = express.Router();

// Route để tạo mới người dùng
router.post("/", validateResource(createUserSchema), createUserHandler);

// ADMIN | Route để lấy thông tin nhiều người dùng
router.get("/", (req, res) => {
  // Logic để lấy thông tin người dùng theo ID
});

// Route để lấy thông tin người dùng
router.get("/:id", (req, res) => {
  // Logic để lấy thông tin người dùng theo ID
});

// Route để cập nhật thông tin người dùng
router.put("/:id", (req, res) => {
  // Logic để cập nhật thông tin người dùng theo ID
});

// Route để xóa người dùng
router.delete("/:id", (req, res) => {
  // Logic để xóa người dùng theo ID
});

export default router;
