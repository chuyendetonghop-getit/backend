// Auth controller

import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";

import config from "config";
import { ETokenTypes } from "../constant/enum";
import { OTP_TYPE_SHOW_OFF } from "../constant/shared.constant";
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
import { login, verifyOTP } from "../service/auth.service";
import { sendEmail } from "../service/email.service";
import { createToken, findToken, updateToken } from "../service/token.service";
import { createUser, findUser, updateUser } from "../service/user.service";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";
import { sendSMS } from "../utils/sms";
import { omit } from "lodash";

export async function loginHandler(
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response
) {
  try {
    const { phone, password } = req.body;
    const user = await login(phone, password);
    return sendSuccessResponse(res, user, HttpStatusCode.Ok, "Login success");
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
    const user = await createUser(req.body);
    return sendSuccessResponse(res, user, HttpStatusCode.Ok, "Sign up success");
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
    const { userId, resendType } = req.body;
    console.log("userId", userId);
    console.log("resendType", resendType);

    const token = await findToken({ userId });
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

    // Gửi OTP qua SMS

    const user = await findUser({ _id: userId });

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
    const { userId, otpVerify } = req.body;

    const user = await findUser({ _id: userId });
    if (user?.verify) {
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "User already verified"
      );
    }
    // Logic để xác thực SMS OTP
    const isVerified = await verifyOTP(
      userId,
      ETokenTypes.OTP_VERIFY,
      otpVerify
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
      // Update user status
      const user = await updateUser({ _id: userId }, { verify: true });

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

    console.log("userOrNot", userOrNot);

    if (!userOrNot) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }

    const token = await findToken({ userId: userOrNot._id });

    const randomOTPCode = crypto.randomInt(100000, 999999).toString();

    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

    const hash = await bcrypt.hashSync(randomOTPCode, salt);

    console.log("hash", hash);
    console.log("randomOTPCode", randomOTPCode);

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
    const { userId, otpReset } = req.body;

    const user = await findUser({ _id: userId });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }

    // Logic để xác thực SMS OTP Forgot Password
    const isVerified = await verifyOTP(userId, ETokenTypes.OTP_RESET, otpReset);
    logger.info("isVerified boolean", isVerified);

    if (!isVerified) {
      logger.info("isVerified false");
      return sendErrorResponse(
        res,
        HttpStatusCode.NotFound,
        "OTP is invalid or expired"
      );
    } else {
      const userWithoutPassword = omit(user, "password");

      return sendSuccessResponse(
        res,
        userWithoutPassword,
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
    const { userId, newPassword } = req.body;

    const user = await findUser({ _id: userId });
    if (!user?._id) {
      return sendErrorResponse(res, HttpStatusCode.NotFound, "User not found");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

    const hash = await bcrypt.hashSync(newPassword, salt);

    // Update user password
    const updatedUser = await updateUser(
      { _id: userId },
      { password: hash },
      {
        new: true,
        lean: true,
      }
    );

    const userWithoutPassword = omit(updatedUser, "password");

    return sendSuccessResponse(
      res,
      userWithoutPassword,
      HttpStatusCode.Ok,
      "Forgot password OTP verified successfully"
    );
  } catch (e: any) {
    logger.error;
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
