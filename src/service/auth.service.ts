// Auth service

import bcrypt from "bcrypt";
import config from "config";
import { omit } from "lodash";

import { ETokenTypes } from "../constant/enum";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { findToken } from "./token.service";
import { findUser } from "./user.service";

export async function login(phone: string, password: string) {
  const user = await findUser({ phone });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt
    .compare(password, user.password)
    .catch((e) => false);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  // Chuyển đổi instance model thành plain JavaScript object
  // const userObject = user.toObject();

  const userWithoutPassword = omit(user, "password");

  //   Generate JWT
  const accessToken = signJwt(
    { ...userWithoutPassword },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  return {
    ...userWithoutPassword,
    accessToken,
  };
}

export async function verifyOTP(
  userId: string,
  tokenType: ETokenTypes,
  otp: string
): Promise<boolean> {
  // Logic để xử lý quên mật khẩu
  // 1. Tìm token trong database

  console.log("XxxxxxxxxX");

  const token = await findToken({ userId });
  console.log("TOKEN DB", token);

  // 1.1. Nếu không tồn tại -> false
  if (!token) {
    return false;
  }

  const OTP_db = token[tokenType] ?? "";
  const OTP_expire = token[`${tokenType}ExpireAt`] ?? "";
  logger.info(OTP_db);
  logger.info(OTP_expire);

  // 2. So sánh OTP trong token với OTP người dùng nhập vào
  const isMatch = await bcrypt.compare(otp, OTP_db).catch((e) => false);
  if (!isMatch) {
    logger.info("OTP is not match");
    return false;
  }

  // 5. Nếu hết hạn -> false
  const isExpired = new Date(OTP_expire) < new Date();
  if (isExpired) {
    return false;
  }
  // 7. Nếu không hết hạn + trùng khớp -> true
  if (isMatch && !isExpired) {
    logger.info(otp);
    logger.info("OTP is verified");
    return true;
  }

  return false;
}
