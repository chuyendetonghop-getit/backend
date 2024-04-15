import { Response } from "express";

export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  code: number,
  message: string = "Success"
): void {
  const responseBody = {
    data,
    success: true,
    code,
    message,
  };
  res.status(code).json(responseBody);
}

export function sendErrorResponse(
  res: Response,
  code: number,
  message: string = "Error"
): void {
  const responseBody = {
    success: false,
    code,
    message,
  };
  res.status(code).json(responseBody);
}

export function sendPagingResponse<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  limit: number,
  code: number,
  message: string = "Success"
): void {
  const responseBody = {
    data: {
      items,
      total,
      page,
      limit,
    },
    success: true,
    code,
    message,
  };
  res.status(code).json(responseBody);
}
