// report.service.ts

import ReportModel from "../models/report.model";
import { CreateReportInput } from "../schema/report.schema";

export async function createReport(input: CreateReportInput["body"]) {
  try {
    const Post = await ReportModel.create(input);
    return Post;
  } catch (error) {
    throw new Error("Error when create report");
  }
}
