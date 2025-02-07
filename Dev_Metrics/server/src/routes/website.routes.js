import express from "express";
import {
  monitor,
  websiteCheck,
} from "../controller/websiteMonitor.controller.js";
import { checkAndRenewToken } from "../middleware/auth.middleware.js";

const webRoute = express.Router();

webRoute.post("/monitor", checkAndRenewToken, monitor);

webRoute.get("/websiteCheck/:id", checkAndRenewToken, websiteCheck);

export default webRoute;
