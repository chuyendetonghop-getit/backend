// report.service.ts

import { FilterQuery } from "mongoose";
import ReportModel, { ReportDocument } from "../models/report.model";
import { CreateReportInput } from "../schema/report.schema";

export async function createReport(input: CreateReportInput["body"]) {
  try {
    const Post = await ReportModel.create(input);
    return Post;
  } catch (error) {
    throw new Error("Error when create report");
  }
}

// find report by postId and reporterId
export async function findReport(query: FilterQuery<ReportDocument>) {
  return ReportModel.findOne(query).lean();
}

// update report
export async function updateReport(
  query: FilterQuery<ReportDocument>,
  update: Pick<CreateReportInput["body"], "reason">
) {
  return ReportModel.findOneAndUpdate(query, update, { new: true }).lean();
}
