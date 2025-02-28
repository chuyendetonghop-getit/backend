// Auth controller

import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import config from "config";
import crypto from "crypto";
import { Request, Response } from "express";
import { omit } from "lodash";
import { ETokenTypes } from "../constant/enum";
import { OTP_TYPE_SHOW_OFF } from "../constant/shared.constant";
import UserModel from "../models/user.model";
import {
  ForgotPasswordInput,
  LoginInput,
  UpdatePasswordInput,
} from "../schema/auth.schema";
import {
  VerifyTokenForgotPasswordInput,
  VerifyTokenSignupInput,
  resendOTPInput,
} from "../schema/token.schema";
import { CreateUserInput } from "../schema/user.schema";
import { verifyOTP } from "../service/auth.service";
import { createToken, findToken, updateToken } from "../service/token.service";
import { findUser, updateUser } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";
import { sendSMS } from "../utils/sms";

export async function loginHandler(
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response
) {
  try {
    const { phone, password } = req.body;
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
    const userWithoutPassword = omit(user, "password");
    //   Generate JWT
    const accessToken = signJwt(
      { ...userWithoutPassword },
      { expiresIn: config.get("accessTokenTtl") }
    );
    const data = {
      ...userWithoutPassword,
      accessToken,
    };

    return sendSuccessResponse(res, data, HttpStatusCode.Ok, "Login success");
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function signupHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const input = req.body;
    const existingUser = await UserModel.findOne({ phone: input.phone });
    if (existingUser) {
      throw new Error(`User with phone number ${input.phone} already exists`);
    }
    const user = await UserModel.create(input);

    const randomOTPCode = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(randomOTPCode, salt);

    await createToken({
      userId: user._id,
      otpVerify: hash,
      otpVerifyExpireAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    await sendSMS(
      user.phone,
      `${
        OTP_TYPE_SHOW_OFF[ETokenTypes.OTP_VERIFY]
      }: Your OTP is ${randomOTPCode}. It will expire in 5 minutes`
    );

    return sendSuccessResponse(res, null, HttpStatusCode.Ok, "Sign up success");
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function resendOTPHandler(
  req: Request<{}, {}, resendOTPInput["body"]>,
  res: Response
) {
  try {
    const { phone, resendType } = req.body;
    const user = await findUser({ phone });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }
    const token = await findToken({ userId: user?._id });
    if (!token) {
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "Token not found, please sign up again"
      );
    }
    const randomOTPCode = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(randomOTPCode, salt);
    const updatedTokenFields = {
      [resendType]: hash,
      [`${resendType}ExpireAt`]: new Date(
        Date.now() + 5 * 60 * 1000
      ).toISOString(),
    };
    await token.updateOne(updatedTokenFields);
    const message = `${
      OTP_TYPE_SHOW_OFF[resendType as ETokenTypes]
    }: Your OTP is ${randomOTPCode}. It will expire in 5 minutes`;
    await sendSMS(user?.phone ?? "", message);
    return sendSuccessResponse(
      res,
      {},
      HttpStatusCode.Ok,
      "Resend OTP success, please check your phone for OTP code"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function verifySignupHandler(
  req: Request<{}, {}, VerifyTokenSignupInput["body"]>,
  res: Response
) {
  try {
    const { phone, otpVerify } = req.body;
    const user = await findUser({ phone });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }
    if (user && user?.verify) {
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "User already verified"
      );
    }
    const isVerified = await verifyOTP(
      user?._id,
      ETokenTypes.OTP_VERIFY,
      otpVerify
    );
    if (!isVerified) {
      logger.info("isVerified false");
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "OTP is invalid or expired"
      );
    } else {
      await updateUser({ phone }, { verify: true });
      return sendSuccessResponse(
        res,
        {},
        HttpStatusCode.Ok,
        "User verified successfully"
      );
    }
  } catch (e: any) {
    logger.error;
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput["body"]>,
  res: Response
) {
  try {
    const { phone } = req.body;
    const userOrNot = await findUser({ phone });
    if (!userOrNot) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }
    const token = await findToken({ userId: userOrNot._id });
    const randomOTPCode = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
    const hash = await bcrypt.hashSync(randomOTPCode, salt);
    try {
      await updateToken(
        { _id: token?._id },
        {
          otpReset: hash,
          otpResetExpireAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        }
      );
    } catch (error) {
      console.log("error", error);
    }
    const message = `${
      OTP_TYPE_SHOW_OFF[ETokenTypes.OTP_RESET]
    }: Your OTP is ${randomOTPCode}. It will expire in 5 minutes`;
    await sendSMS(phone, message);
    return sendSuccessResponse(
      res,
      {},
      HttpStatusCode.Ok,
      "Send OTP success, please check your phone for OTP code"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.Conflict, e.message);
  }
}

export async function verifyForgotPasswordHandler(
  req: Request<{}, {}, VerifyTokenForgotPasswordInput["body"]>,
  res: Response
) {
  try {
    const { phone, otpReset } = req.body;

    const user = await findUser({ phone: phone });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }

    // Logic để xác thực SMS OTP Forgot Password
    const isVerified = await verifyOTP(
      user._id,
      ETokenTypes.OTP_RESET,
      otpReset
    );
    logger.info("isVerified boolean", isVerified);

    if (!isVerified) {
      logger.info("isVerified false");
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "OTP is invalid or expired"
      );
    } else {
      // const userWithoutPassword = omit(user, "password");

      return sendSuccessResponse(
        res,
        null,
        HttpStatusCode.Ok,
        "Forgot password OTP verified successfully"
      );
    }
  } catch (e: any) {
    logger.error;
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}

export async function updatePasswordHandler(
  req: Request<{}, {}, UpdatePasswordInput["body"]>,
  res: Response
) {
  try {
    const { phone, newPassword } = req.body;

    const user = await findUser({ phone: phone });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

    const hash = await bcrypt.hashSync(newPassword, salt);

    // Update user password
    const updatedUser = await updateUser(
      { phone: phone },
      { password: hash },
      {
        new: true,
        lean: true,
      }
    );

    // const userWithoutPassword = omit(updatedUser, "password");

    return sendSuccessResponse(
      res,
      null,
      HttpStatusCode.Ok,
      "Update password successfully"
    );
  } catch (e: any) {
    logger.error;
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
