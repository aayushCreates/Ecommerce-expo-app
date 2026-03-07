import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

export const isUserLoggedIn = [
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res
          .status(401)
          .json({ 
            success: false,
            message: "Unauthorized - invalid token" });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - user not found" });
  }

  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({
      success: false,
      message: "Forbidden - admin access only",
    });
  }

  next();
};
