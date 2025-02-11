import express from "express";
import {
  signup,
  login,
  logout,
  validateToken,
  confirmEmail,
  sendMailToken,
} from "../controller/user.controller.js";

import { checkAndRenewToken } from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.get("/confirm-email", confirmEmail);
userRoute.post("/sendMail", sendMailToken);
userRoute.post("/signup", signup);
userRoute.post("/login", login);
userRoute.post("/logout", logout);
userRoute.get("/authUser", checkAndRenewToken, validateToken);

export default userRoute;
