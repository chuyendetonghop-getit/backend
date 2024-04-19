import { Request, Response, NextFunction } from "express";
import { EUserRoles } from "../constant/enum";

const validateRoleHeader = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = req.header("x-role");

  if (!role) {
    return res
      .status(400)
      .json({ success: false, message: "x-role header is required" });
  }

  if (role !== EUserRoles.ADMIN && role !== EUserRoles.USER) {
    return res.status(400).json({ success: false, message: "Role is invalid" });
  }

  next();
};

export default validateRoleHeader;
