import mongoose from "mongoose";
import config from "config";
import logger from "./logger";
import UserModel from "../models/user.model";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri, {
      dbName: config.get<string>("dbName"),
    });
    logger.info("DB connected");

    try {
      const adminUser = await UserModel.findOne({ role: "admin" });

      if (!adminUser) {
        await UserModel.create({
          name: "Admin",
          phone: "0912345678",
          password: "@123Admin",
          verify: true,
          role: "admin",
          email: "getit.admin@gmail.com",
        });
        logger.info("Admin user created");
      } else {
        logger.info("Admin user already exists");
      }
    } catch (error) {
      logger.error("Could not create admin user");
      console.error(error);
    }
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
