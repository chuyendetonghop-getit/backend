// report.route.ts

import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createReportInPutSchema,
  createReportSchema,
} from "../schema/report.schema";
import { createReportHandler } from "../controller/report.controller";

const router = express.Router();

router.post(
  "/",
  validateResource(createReportInPutSchema),
  createReportHandler
);

export default router;
