import config from "config";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import connect from "./utils/connect";
import logger from "./utils/logger";

import { seedPostHandler, seedUserHandler } from "./controller/seed.controller";
import { socketListener } from "./controller/socket.controller";

import loggerMiddleware from "./middleware/loggerMiddleware";
import socketMiddleware from "./middleware/socketMiddleware";
import validateToken from "./middleware/validateToken";

import authRouter from "./routes/auth.route";
import conversationRouter from "./routes/conversation.route";
import messageRouter from "./routes/message.route";
import postRouter from "./routes/post.route";
import userRouter from "./routes/user.route";

dotenv.config();

const apiRouter = express.Router();

const port = config.get<number>("port");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

// I want to ignore cors error by using cors package
app.use(cors());

app.use(express.json());

// Sử dụng middleware để log thông tin về request
app.use(loggerMiddleware);

// Thêm một route mới, để kiểm tra xem server có hoạt động không và trả về kèm thời gian hiện tại
app.get("/", (req, res) => {
  return res.send(
    "Hello World From Get - It Project 💚💙🩷 " + new Date().toLocaleString()
  );
});

// route to seed data
app.get("/seed/user/:number", seedUserHandler);
app.get("/seed/post/:number", seedPostHandler);

app.use("/api/v1", apiRouter);

// Sử dụng các router con vào router chính
apiRouter.use("/auth", authRouter);

// Start apply middleware
apiRouter.use(validateToken);

apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);
apiRouter.use("/conversation", conversationRouter);
apiRouter.use("/message", messageRouter);

// socket.io middleware to check token
io.use(socketMiddleware);

socketListener(io);

httpServer.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
