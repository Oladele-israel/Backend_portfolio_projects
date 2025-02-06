import express from "express";
import {
  signup,
  login,
  logout,
  validateToken,
} from "../controller/user.controller.js";

import { checkAndRenewToken } from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.get("/authUser", checkAndRenewToken, validateToken);

export default userRoute;
