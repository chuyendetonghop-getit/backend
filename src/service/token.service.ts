import { FilterQuery } from "mongoose";
import TokenModel, { TokenDocument } from "../models/token.model";
import { CreateTokenInput } from "../schema/token.schema";

// Token service

export async function findToken(query: FilterQuery<TokenDocument>) {
  return TokenModel.findOne(query);
}

export async function createToken(input: CreateTokenInput["body"]) {
  return new TokenModel(input).save();
}

export async function updateToken(
  query: FilterQuery<TokenDocument>,
  update: Partial<TokenDocument>
) {
  console.log("query", query);
  console.log("update", update);
  return TokenModel.findOneAndUpdate(query, update);
}
