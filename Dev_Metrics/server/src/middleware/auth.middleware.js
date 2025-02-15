import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const checkAndRenewToken = async (req, res, next) => {
  try {
    const { Juice: accessToken, Sauce: refreshToken } = req.cookies;

    // Check if tokens are provided
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Helper function to verify JWT tokens
    const verifyToken = (token, secret) =>
      new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        });
      });

    let userId;

    // Verify access token
    if (accessToken) {
      try {
        const decoded = await verifyToken(accessToken, process.env.JUICE);
        userId = decoded.access2;
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Access token expired or invalid" });
      }
    }

    // If access token is invalid or expired, try refreshing with the refresh token
    if (!userId && refreshToken) {
      try {
        const decoded = await verifyToken(refreshToken, process.env.SAUCE);
        userId = decoded.access2; // Extract user ID from the refresh token

        // Find user in the database using Prisma
        const user = await prisma.users.findUnique({
          where: { id: userId },
          select: { id: true, name: true },
        });

        if (!user) {
          return res.status(401).json({ message: "User not found" });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
          { access1: user.name, access2: user.id },
          process.env.JUICE,
          { expiresIn: "15m" }
        );

        // Set the new access token in the cookie
        res.cookie("Juice", newAccessToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: false,
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // Attach the user to the request object
        req.user = user;
      } catch (err) {
        return res
          .status(401)
          .json({ message: "Refresh token expired or invalid" });
      }
    }

    // If a valid user ID is found, fetch the user details
    if (userId) {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach the user to the request object
      req.user = user;
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
