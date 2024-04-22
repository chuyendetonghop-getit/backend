import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import mongoosePaginate from "mongoose-paginate-v2";
import { EUserRoles } from "../constant/enum";

export interface UserInput {
  name: string;
  // email?: string;
  phone: string;
  password: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
  verify: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verify: { type: Boolean, default: false },
    role: { type: String, default: EUserRoles.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as unknown as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

userSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model<
  UserDocument,
  mongoose.PaginateModel<UserDocument>
>("User", userSchema, "users");

export default UserModel;
