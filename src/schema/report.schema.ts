import { TypeOf, object, string } from "zod";

const payload = {
  body: object({
    postId: string({
      required_error: "Post ID is required",
    }),
    reason: string({
      required_error: "Reason is required",
    }),
    reporterId: string({
      required_error: "Reporter ID is required",
    }),
  }),
};

export const createReportSchema = object({
  ...payload,
});

export const createReportInPutSchema = object({
  body: payload.body.omit({ reporterId: true }),
});

export type CreateReportInput = TypeOf<typeof createReportSchema>;
