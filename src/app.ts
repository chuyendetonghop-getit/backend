import config from "config";
import dotenv from "dotenv";
import express from "express";
import connect from "./utils/connect";
import logger from "./utils/logger";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import postRouter from "./routes/post.route";
import validateToken from "./middleware/validateToken";
import loggerMiddleware from "./middleware/loggerMiddleware";

dotenv.config();

const apiRouter = express.Router();

const port = config.get<number>("port");

const app = express();

app.use(express.json());

// Sử dụng middleware để log thông tin về request
app.use(loggerMiddleware);

// Thêm một route mới, để kiểm tra xem server có hoạt động không và trả về kèm thời gian hiện tại
app.get("/", (req, res) => {
  return res.send(
    "Hello World From Get - It Project 💚💙🩷 " + new Date().toLocaleString()
  );
});

app.use("/api/v1", apiRouter);

// Sử dụng các router con vào router chính
apiRouter.use("/auth", authRouter);

// Start apply middleware
apiRouter.use(validateToken);

apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
