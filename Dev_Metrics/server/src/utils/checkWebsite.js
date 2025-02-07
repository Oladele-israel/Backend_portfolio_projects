import axios from "axios";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
const prisma = new PrismaClient();

// service function that pings and checks the website
export const pingWebsite = async (url, userId) => {
  const startTime = Date.now();

  try {
    const response = await axios.get(url);

    // Calculate response time
    const responseTime = Date.now() - startTime;
    const responseTimeSec = parseFloat((responseTime / 1000).toFixed(3));

    // Create or connect to the website and record the check
    const check = await prisma.statusCheck.create({
      data: {
        website: {
          connectOrCreate: {
            where: { url },
            create: { url, userId },
          },
        },
        statusCode: response.status,
        responseTime: responseTimeSec,
        error: null,
        isUp: true,
      },
    });

    return {
      isUp: true,
      responseTime: responseTime,
      response_secs: `${responseTimeSec}secs`,
      statusCode: check.statusCode,
    };
  } catch (error) {
    const check = await prisma.statusCheck.create({
      data: {
        website: {
          connectOrCreate: {
            where: { url },
            create: { url, userId },
          },
        },
        statusCode: error.response?.status || 500,
        responseTime: -1,
        error: error.message || "Unknown error",
        isUp: false,
      },
    });

    return {
      isUp: false,
      responseTime: check.responseTime,
      statusCode: check.statusCode,
      error: check.error,
    };
  }
};

// cron job to ping  the websitwe every 2mins
cron.schedule("*/5 * * * *", async () => {
  console.log("Running cron job...");

  try {
    // Fetch all websites with associated users in one query
    const websites = await prisma.website.findMany({
      select: { url: true, userId: true },
    });

    if (websites.length === 0) {
      console.log("No websites found to check.");
      return;
    }

    // Group websites by userId
    const websitesByUser = websites.reduce((acc, { userId, url }) => {
      if (!acc[userId]) acc[userId] = [];
      acc[userId].push(url);
      return acc;
    }, {});

    // Ping all websites concurrently
    await Promise.all(
      Object.entries(websitesByUser).map(async ([userId, urls]) => {
        console.log(`Pinging ${urls.length} websites for user: ${userId}`);
        await Promise.all(urls.map((url) => pingWebsite(url, userId)));
      })
    );

    console.log("Cron job completed successfully.");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Cron job to aggregate data and delete old entries at 12:00 AM midnight

cron.schedule("0 0 * * *", async () => {
  console.log("Running aggregation and cleanup cron job...");

  try {
    // Fetch all websites
    const websites = await prisma.website.findMany();

    for (const website of websites) {
      // Fetch all status checks for the website in the last 24 hours
      const checks = await prisma.statusCheck.findMany({
        where: {
          websiteId: website.id,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      const totalChecks = checks.length;

      if (totalChecks === 0) {
        console.log(`No checks found for ${website.url}, skipping.`);
        continue;
      }

      // Calculate uptime and downtime
      const uptimeCount = checks.filter((check) => check.isUp).length;
      const downtimeCount = totalChecks - uptimeCount;
      const uptimePercentage = ((uptimeCount / totalChecks) * 100).toFixed(2);

      // Save aggregated data
      await prisma.websiteDailySummary.upsert({
        where: {
          websiteId_date: {
            websiteId: website.id,
            date: new Date().toISOString().split("T")[0], // Store only the date
          },
        },
        update: {
          uptimeCount,
          downtimeCount,
          uptimePercentage: parseFloat(uptimePercentage),
        },
        create: {
          websiteId: website.id,
          date: new Date().toISOString().split("T")[0],
          uptimeCount,
          downtimeCount,
          uptimePercentage: parseFloat(uptimePercentage),
        },
      });

      // Delete individual status checks
      await prisma.statusCheck.deleteMany({
        where: {
          websiteId: website.id,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      console.log(
        `Summary saved for ${website.url}: ${uptimePercentage}% uptime.`
      );
    }

    console.log("Aggregation and cleanup cron job completed successfully.");
  } catch (error) {
    console.error("Error in aggregation and cleanup cron job:", error);
  }
});
