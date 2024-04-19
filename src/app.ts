import config from "config";
import dotenv from "dotenv";
import express from "express";
import connect from "./utils/connect";
import logger from "./utils/logger";

import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";

dotenv.config();

const apiRouter = express.Router();

const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.use("/api/v1", apiRouter);

// Sử dụng các router con vào router chính
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
