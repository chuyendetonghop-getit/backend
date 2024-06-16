// report.service.ts

import { FilterQuery } from "mongoose";
import ReportModel, { ReportDocument } from "../models/report.model";
import { CreateReportInput } from "../schema/report.schema";

// Report service

export async function createReport(input: CreateReportInput["body"]) {
  try {
    const Post = await ReportModel.create(input);
    return Post;
  } catch (error) {
    throw new Error("Error when create report");
  }
}

export async function findReport(query: FilterQuery<ReportDocument>) {
  return ReportModel.findOne(query).lean();
}

export async function updateReport(
  query: FilterQuery<ReportDocument>,
  update: Pick<CreateReportInput["body"], "reason">
) {
  return ReportModel.findOneAndUpdate(query, update, { new: true }).lean();
}
