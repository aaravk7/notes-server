import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "types";

function isUserJwtPayload(payload: jwt.JwtPayload): payload is { _id: string } {
  return typeof payload._id === "string";
}

const isLoggedIn = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    if (isUserJwtPayload(data)) {
      req.userId = data._id;
      return next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default isLoggedIn;
