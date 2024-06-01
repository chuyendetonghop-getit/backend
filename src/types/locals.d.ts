import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Locals {
      user: UserDocument;
    }
  }
}
