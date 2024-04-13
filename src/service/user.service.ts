import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import UserModel, { UserDocument, UserInput } from "../models/user.model";
import logger from "../utils/logger";

export async function createUser(input: UserInput) {
  const existingUser = await UserModel.findOne({ email: input.email });

  if (existingUser) {
    throw new Error(`User with email ${input.email} already exists`);
  }

  const user = await UserModel.create(input);
  return omit(user.toJSON(), "password");
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);
  logger.info(`Password validation for email ${email} is ${isValid}`);
  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
