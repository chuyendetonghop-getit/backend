import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { omit } from "lodash";
import { FilterQuery } from "mongoose";

import UserModel, { UserDocument, UserInput } from "../models/user.model";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import { sendSMS } from "../utils/sms";
import { createToken } from "./token.service";
import { OTP_TYPE_SHOW_OFF } from "../constant/shared.constant";
import { ETokenTypes } from "../constant/enum";

export async function createUser(input: UserInput) {
  const existingUser = await UserModel.findOne({ phone: input.phone });

  if (existingUser) {
    throw new Error(`User with phone number ${input.phone} already exists`);
  }

  const user = await UserModel.create(input);

  // Chuyển đổi instance model thành plain JavaScript object
  const userObject = user.toObject();

  const userWithoutPassword = omit(userObject, "password");

  const accessToken = signJwt(
    { ...userWithoutPassword },
    "accessTokenPrivateKey",
    {
      expiresIn: config.get("accessTokenTtl"),
    }
  );

  const randomOTPCode = crypto.randomInt(100000, 999999).toString();

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(randomOTPCode, salt);

  // Save hash to database
  await createToken({
    userId: user._id,
    otpVerify: hash,
    otpVerifyExpireAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  // Send sms otp
  await sendSMS(
    user.phone,
    `${
      OTP_TYPE_SHOW_OFF[ETokenTypes.OTP_VERIFY]
    }: Your OTP is ${randomOTPCode}. It will expire in 5 minutes`
  );

  return {
    ...userWithoutPassword,
    accessToken,
  };
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function updateUser(
  query: FilterQuery<UserDocument>,
  update: Partial<UserDocument>,
  config?: UpdateUserOptions
) {
  return UserModel.findOneAndUpdate(query, update, config);
}
