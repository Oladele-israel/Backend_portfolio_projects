import { PrismaClient } from "@prisma/client";
import { pingWebsite } from "../utils/checkWebsite.js";
import redis from "../utils/redisClient.js";
const prisma = new PrismaClient();

// a controller that gets and saves the weburl on the database and then starts the monitoring
export const monitor = async (req, res) => {
  const { url, alert_when, contact_mode } = req.body;
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const existingWebsite = await prisma.website.findUnique({
      where: { url },
    });

    if (existingWebsite) {
      return res.status(400).json({
        success: false,
        message: "This URL is already being monitored.",
      });
    }

    await prisma.website.create({
      data: {
        url,
        alert_when,
        contact_mode,
        userId,
      },
    });

    await redis.del(`websites:${userId}`);

    const result = await pingWebsite(url, userId); // Assuming pingWebsite is a function to monitor the website

    return res.json({
      success: true,
      message: "Website monitoring started",
      data: result,
    });
  } catch (error) {
    console.error("Error in monitor function:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//check the status of a particular website
export const websiteCheck = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const cacheKey = `websiteCheck:${userId}:${id}:page:${page}:limit:${limit}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("cache hit for website");
      return res.status(200).json(JSON.parse(cachedData));
    }

    const website = await prisma.website.findUnique({
      where: { id, userId },
      include: {
        statusChecks: {
          skip: (page - 1) * limit,
          take: +limit,
          orderBy: { checkedAt: "desc" },
        },
      },
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    const totalStatusChecks = await prisma.statusCheck.count({
      where: { websiteId: id },
    });

    res.status(200).json({
      success: true,
      data: {
        ...website,
        pagination: {
          totalItems: totalStatusChecks,
          totalPages: Math.ceil(totalStatusChecks / limit),
          currentPage: +page,
          itemsPerPage: +limit,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching website:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function that fethes and deletes website by id
export const deleteWebsiteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const website = await prisma.website.findUnique({
      where: { id },
      include: { statusChecks: true, dailySummaries: true },
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (website.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this website" });
    }

    await prisma.website.delete({
      where: { id },
    });

    await redis.del(`websites:${userId}`);

    res
      .status(200)
      .json({ message: "Website and associated data deleted successfully" });
  } catch (error) {
    console.error("Error deleting website:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWebsitesByUser = async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is available in the request object

  console.log("this is the user ID---->", userId);

  try {
    // Fetch all websites associated with the user
    const cacheKey = `websites:${userId}`;
    const cachedWebsites = await redis.get(cacheKey);

    if (cachedWebsites) {
      console.log("Fetching websites from cache");
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedWebsites),
      });
    }

    const websites = await prisma.website.findMany({
      where: { userId },
      include: { statusChecks: true }, // Include the status checks for each website
    });

    if (!websites || websites.length === 0) {
      return res
        .status(404)
        .json({ message: "No websites found for this user" });
    }

    await redis.set(cacheKey, JSON.stringify(websites), "EX", 300);
    res.status(200).json({
      success: true,
      data: websites,
    });
  } catch (error) {
    console.error("Error fetching websites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
