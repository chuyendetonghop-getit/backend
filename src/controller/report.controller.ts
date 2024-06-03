// report.controller.ts

import { HttpStatusCode } from "axios";
import { Request, Response } from "express";

import { CreateReportInput } from "../schema/report.schema";
import { createReport } from "../service/report.service";
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
  try {
    const report = await createReport({ ...req.body, reporterId: reporterId });

    return sendSuccessResponse(
      res,
      report,
      HttpStatusCode.Created,
      "Create report success"
    );
  } catch (e: any) {
    logger.error(e);
    return sendErrorResponse(res, HttpStatusCode.NotFound, e.message);
  }
}
