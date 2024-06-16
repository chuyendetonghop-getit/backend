import mongoose from "mongoose";

export interface TokenInput {
  userId: string;
  otpVerify?: string;
  otpVerifyExpireAt?: string;
  otpReset?: string;
  otpResetExpireAt?: string;
}

export interface TokenDocument extends TokenInput, mongoose.Document {}

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    otpVerify: { type: String },
    otpVerifyExpireAt: { type: String },
    otpReset: { type: String },
    otpResetExpireAt: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
// Token Model
const TokenModel = mongoose.model("Token", tokenSchema);

export default TokenModel;
