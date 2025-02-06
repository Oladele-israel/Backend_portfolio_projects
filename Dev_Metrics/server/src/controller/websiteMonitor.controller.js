import express from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

export const monitor = async (req, res) => {
  const { url } = req.body;
  const userId = req.userId;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const result = await pingWebsite(url, userId);
  res.json(result);
};

// app.post("/monitor", authenticate, async (req, res) => {
//   const { url } = req.body;
//   const userId = req.userId;

//   if (!url) {
//     return res.status(400).json({ message: "URL is required" });
//   }

//   const result = await pingWebsite(url, userId);
//   res.json(result);
// });
