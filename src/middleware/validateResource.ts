import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const r = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      console.log(e.errors);
      // return res.status(400).send(e.errors);
      const errorMessages = e.errors.map((err: ZodError) => err.message);
      return res.status(400).json({ success: false, errors: errorMessages });
    }
  };

export default validateResource;
