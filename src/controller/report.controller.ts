// report.controller.ts

import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { CreateReportInput } from "../schema/report.schema";
import {
  createReport,
  findReport,
  updateReport,
} from "../service/report.service";
import logger from "../utils/logger";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/responseTransform";

export async function createReportHandler(
  req: Request<{}, {}, CreateReportInput["body"], {}>,
  res: Response
) {
  const reporterId = res.locals.user._id;
  console.log("reporterId", reporterId);
  const { postId, reason } = req.body;
  try {
    // 1. Find if the report already exists in the database. By postId and reporterId.
    const exportFile = await findReport({
      postId: postId,
      reporterId: reporterId,
    });

    if (exportFile) {
      // 2. If the report exists, update the reason
      const updatedReport = await updateReport(
        { postId: postId, reporterId: reporterId },
        { reason: reason }
      );
      return sendSuccessResponse(
        res,
        updatedReport,
        HttpStatusCode.Ok,
        "Update report success"
      );
    } else {
      // 3. If the report does not exist, create a new report
      const report = await createReport({
        ...req.body,
        reporterId: reporterId,
      });
      return sendSuccessResponse(
        res,
        report,
        HttpStatusCode.Created,
        "Create report success"
      );
    }
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
