import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface ReportInput {
  postId: string;
  reason: string;
  reporterId: string;
}

export interface ReportDocument extends ReportInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    reason: {
      type: String,
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ReportModel = mongoose.model<ReportDocument>("Report", ReportSchema);

export default ReportModel;
