// Auth service

import config from "config";
import { omit } from "lodash";
import { signJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";

import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
  const user = await findUser({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt
    .compare(password, user.password)
    .catch((e) => false);

  if (!isValid) {
    throw new Error("Invalid password");
  }

  //   Generate JWT
  const accessToken = signJwt(
    { ...user },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
  );

  return omit(
    {
      ...user,
      accessToken,
    },
    "password"
  );
}
