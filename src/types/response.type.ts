import { HttpStatusCode } from "axios";

export enum ResponseType {
  Success = "Success",
  Error = "Error",
}

export type TResponse<T = undefined> = {
  data?: T;
  success: boolean;
  code: HttpStatusCode;
  message: string;
};

export type TPaging<T = []> = {
  items: T;
  total: number;
  page: number;
  limit: number;
};
