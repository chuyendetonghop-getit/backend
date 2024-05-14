import { Request, Response, NextFunction } from "express";
import log from "../utils/logger"; // Đường dẫn tới file logger.ts của bạn

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Log thông tin về request
  log.info(`Request :➡ ${req.method} ${req.url}`);

  // Ghi nhận thời gian bắt đầu xử lý request
  const start = Date.now();

  // Khi response đã gửi xong, log thêm thông tin về response
  res.on("finish", () => {
    const duration = Date.now() - start;
    log.fatal(
      `Response ←: ${req.method} ${req.url} ${res.statusCode} ${duration}ms`
    );
  });

  // Tiếp tục xử lý request
  next();
};

export default loggerMiddleware;
