import { PrismaClient } from "@prisma/client";
import { pingWebsite } from "../utils/checkWebsite.js";
const prisma = new PrismaClient();

// a controller that gets and saves the weburl on the database and then starts the monitoring
export const monitor = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const existingWebsite = await prisma.website.findUnique({
      where: { url },
    });

    if (!existingWebsite) {
      await prisma.website.create({
        data: {
          url,
          userId,
        },
      });
    }

    const result = await pingWebsite(url, userId);

    res.json({
      success: true,
      message: "Website monitoring started",
      data: result,
    });
  } catch (error) {
    console.error("Error in monitor function:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//check the status of a particular website
export const websiteCheck = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log("this is ther web id---->", id);
  console.log("this is ther userid---->", userId);

  try {
    const website = await prisma.website.findUnique({
      where: { id, userId },
      include: { statusChecks: true },
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    res.json(website.statusChecks);
  } catch (error) {
    console.error("Error fetching website:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// function that fetches user
export const getWebsitesByUser = async (userId) => {
  if (!userId) {
    throw new Error("userId must be provided!");
  }

  try {
    const userWebsites = await prisma.website.findMany({
      where: { userId },
    });

    console.log("These are the user's websites -->", userWebsites);
    return userWebsites; // Ensure the function returns the fetched websites
  } catch (error) {
    console.error("Error fetching websites:", error);
    throw error; // Rethrow the error for handling in the caller function
  }
};

// function that fethes and deletes website by id
export const deleteWebsiteById = async (req, res) => {
  const { id } = req.params; // Extract website ID from request parameters
  const userId = req.user.id; // Extract user ID from the authenticated user

  try {
    // Step 1: Fetch the website by ID and ensure it belongs to the user
    const website = await prisma.website.findUnique({
      where: { id }, // IDs are UUIDs, no need to parse as integer
      include: { statusChecks: true, dailySummaries: true }, // Include related records
    });

    // Step 2: Check if the website exists and belongs to the user
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    if (website.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this website" });
    }

    // Step 3: Delete the website and its associated data (cascades handled in Prisma schema)
    await prisma.website.delete({
      where: { id },
    });

    // Step 4: Return success response
    res
      .status(200)
      .json({ message: "Website and associated data deleted successfully" });
  } catch (error) {
    // Step 5: Handle errors
    console.error("Error deleting website:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
