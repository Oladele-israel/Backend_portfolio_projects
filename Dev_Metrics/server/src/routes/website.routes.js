import express from "express";
import {
  monitor,
  websiteCheck,
  deleteWebsiteById,
} from "../controller/websiteMonitor.controller.js";
import { checkAndRenewToken } from "../middleware/auth.middleware.js";

const webRoute = express.Router();

webRoute.post("/monitor", checkAndRenewToken, monitor);

webRoute.get("/websiteCheck/:id", checkAndRenewToken, websiteCheck);
webRoute.delete("/websiteDelete/:id", checkAndRenewToken, deleteWebsiteById);

export default webRoute;
