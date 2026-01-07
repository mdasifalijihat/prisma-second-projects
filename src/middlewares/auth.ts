import { auth as betterAuth } from "../lib/auth";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role?: string;
        emailVerified: boolean;
      };
    }
  }
}

// ===== USER ROLES =====
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// ===== AUTH MIDDLEWARE =====
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.headers);
      //get user session from better-auth 
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      if (!session.user.emailVerified) {
        return res
          .status(403)
          .json({ success: false, message: "Email not verified" });
      }

      const userRole = (session.user.role || "USER").toUpperCase();

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || "",
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (
        roles.length &&
        !roles.map((r) => r.toUpperCase()).includes(userRole)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Insufficient role" });
      }

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
};

export default auth;
