import config from "config";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import connect from "./utils/connect";
import logger from "./utils/logger";

import loggerMiddleware from "./middleware/loggerMiddleware";
import validateToken from "./middleware/validateToken";
import authRouter from "./routes/auth.route";
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

app.use("/api/v1", apiRouter);

// Sử dụng các router con vào router chính
apiRouter.use("/auth", authRouter);

// Start apply middleware
apiRouter.use(validateToken);

apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);

// socket.io middleware to check token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (token) {
    return next();
  }

  return next(new Error("Authentication error"));
});

io.on("connection", (socket) => {
  logger.warn("A user connected ->", socket.id);

  socket.on("disconnect", () => {
    logger.error("A user disconnected ->", socket.id);
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
