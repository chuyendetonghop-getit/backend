# Backend API GetIt Server

Backend API cho ứng dụng GetIt - Nền tảng rao vặt và chat trực tuyến.

## Mô tả dự án

GetIt là một nền tảng rao vặt cho phép người dùng:

- Đăng tin rao vặt với hình ảnh và thông tin chi tiết
- Tìm kiếm tin đăng dựa trên vị trí địa lý
- Chat trực tiếp giữa người mua và người bán
- Quản lý tin đăng và hội thoại

### Công nghệ sử dụng

- **Framework**: Express.js với TypeScript
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT
- **Real-time Communication**: Socket.IO
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Jest (planned)
- **Package Manager**: pnpm

### Tính năng chính

1. **Xác thực & Phân quyền**

   - Đăng ký/Đăng nhập với số điện thoại
   - Xác thực OTP qua SMS
   - Phân quyền người dùng/admin

2. **Quản lý tin đăng**

   - CRUD tin đăng
   - Upload hình ảnh
   - Phân loại theo danh mục
   - Tìm kiếm theo vị trí địa lý

3. **Chat trực tuyến**

   - Chat 1-1 giữa người dùng
   - Gửi tin nhắn văn bản và hình ảnh
   - Quản lý cuộc hội thoại

4. **Quản lý người dùng**
   - Cập nhật thông tin cá nhân
   - Quản lý tin đăng cá nhân
   - Xem lịch sử chat

## Cài đặt và Chạy

1. **Yêu cầu hệ thống**

   - Node.js >= 14
   - MongoDB
   - pnpm

2. **Cài đặt dependencies**

```bash
pnpm install
```

3. **Cấu hình môi trường**

   - Tạo file config/default.ts theo mẫu
   - Cấu hình các biến môi trường cần thiết

4. **Chạy ứng dụng**

```bash
# Development
pnpm dev

# Build
pnpm build
```

## Branch conventions

A git branch should start with a category. Pick one of these: feature, bugfix, hotfix, or test.

- feature is for adding, refactoring or removing a feature
- bugfix is for fixing a bug
- hotfix is for changing code with a temporary solution and/or without following the usual process (usually because of an emergency)
- test is for experimenting outside of an issue/ticket

## Commit conventions

- feat is for adding a new feature
- fix is for fixing a bug
- refactor is for changing code for peformance or convenience purpose (e.g. readibility)
- chore is for everything else (writing documentation, formatting, adding tests, cleaning useless code etc.)

## Cấu trúc thư mục

```
src/
├── constant/     # Các hằng số và enums
├── controller/   # Xử lý request/response
├── middleware/   # Express middlewares
├── models/       # Mongoose models
├── routes/       # Định nghĩa routes
├── schema/       # Validation schemas
├── service/      # Business logic
├── types/        # TypeScript type definitions
└── utils/        # Các utility functions
```

## API Documentation

[Link to API documentation - TODO]

## Contributing

1. Fork dự án
2. Tạo branch mới theo quy ước
3. Commit changes theo quy ước
4. Tạo Pull Request

## License

MIT
