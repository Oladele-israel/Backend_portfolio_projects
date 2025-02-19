import axios from "axios";
import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import dns from "dns";
import { performance } from "perf_hooks";
import https from "https";
import ipinfo from "ipinfo";
import { getUserSocket, io } from "../index.js";

const prisma = new PrismaClient();

export const pingWebsite = async (url, userId) => {
  const startTime = performance.now(); // Use high-resolution timing

  try {
    // DNS resolution time
    const dnsStart = performance.now();
    const dnsLookup = await dns.promises.lookup(new URL(url).hostname);
    const dnsTime = performance.now() - dnsStart;

    // Make the request
    const response = await axios.get(url, {
      timeout: 5000, // Set a timeout
      maxRedirects: 5, // Limit redirects
      // headers: {
      //   "User-Agent": "WebsiteMonitor/1.0", // Custom User-Agent
      // },
    });

    // Calculate response time
    const responseTime = performance.now() - startTime;
    const responseTimeSec = parseFloat((responseTime / 1000).toFixed(3));

    // Extract headers
    const headers = response.headers;

    // SSL/TLS Certificate Information (if HTTPS)
    let sslInfo = null;
    if (url.startsWith("https://")) {
      sslInfo = await getSSLCertificateInfo(url);
    }

    // Content size and compression
    const contentSize = response.data.length;
    const contentEncoding = headers["content-encoding"] || "none";

    // Redirect information
    const redirectCount = response.request._redirectCount || 0;
    const finalUrl = response.request.res.responseUrl || url;

    // Geographic location (using IPinfo)
    const geoLocation = await ipinfo(dnsLookup.address);

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
        dnsTime: parseFloat((dnsTime / 1000).toFixed(3)), // Save DNS time
        headers: JSON.stringify(headers), // Save headers
        contentSize, // Save content size
        contentEncoding, // Save content encoding
        redirectCount, // Save number of redirects
        finalUrl, // Save final URL after redirects
        sslInfo: sslInfo ? JSON.stringify(sslInfo) : null, // Save SSL info
        geoLocation: JSON.stringify(geoLocation), // Save geographic location
        error: null,
        isUp: true,
      },
    });

    return {
      isUp: true,
      responseTime: responseTime,
      response_secs: `${responseTimeSec}secs`,
      statusCode: check.statusCode,
      dnsTime: `${parseFloat((dnsTime / 1000).toFixed(3))}secs`,
      contentSize: `${contentSize} bytes`,
      contentEncoding,
      redirectCount,
      finalUrl,
      sslInfo,
      geoLocation,
    };
  } catch (error) {
    // Error details
    const errorType = error.code || "Unknown";
    const errorStack = error.stack || "No stack trace available";

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
        errorType,
        errorStack,
        isUp: false,
      },
    });

    return {
      isUp: false,
      responseTime: check.responseTime,
      statusCode: check.statusCode,
      error: check.error,
      errorType,
      errorStack,
    };
  }
};

// Helper function to get SSL/TLS certificate information
const getSSLCertificateInfo = async (url) => {
  return new Promise((resolve, reject) => {
    const hostname = new URL(url).hostname;
    const port = 443;

    const req = https.request({ hostname, port, method: "HEAD" }, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (cert) {
        resolve({
          issuer: cert.issuer,
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          validityPeriod:
            (new Date(cert.valid_to) - new Date(cert.valid_from)) /
            (1000 * 60 * 60 * 24), // In days
        });
      } else {
        resolve(null);
      }
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
};

// cron job to ping  the websitwe every 5mins and saves the request in the database
// cron job to ping the website every 5 minutes and save the request in the database
cron.schedule("*/5 * * * *", async () => {
  console.log("Running 5mins ping cron...");

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

        await Promise.all(
          urls.map(async (url) => {
            try {
              const result = await pingWebsite(url, userId);
              io.to(getUserSocket(userId)).emit("websiteStatusUpdate", {
                url,
                id,
                isUp: result.isUp,
                responseTime: result.responseTime,
                checkedAt: new Date().toISOString(),
              });
              console.log(`Sent update to user ${userId} for ${url}:`, {
                isUp: result.isUp,
                responseTime: result.responseTime,
              });
              // Emit a Socket.IO event to the frontend
            } catch (error) {
              console.error(`Failed to ping ${url} for user ${userId}:`, error);
            }
          })
        );
      })
    );

    console.log("5mins Cron completed successfully, see you in 5✌.");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Cron job to aggregate data and delete old entries at 12:00 AM midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running aggregation and cleanup cron job...");
  const today = new Date();
  const utcDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );

  try {
    // Fetch all websites
    const websites = await prisma.website.findMany();

    for (const website of websites) {
      // Aggregate status checks for the website in the last 24 hours
      const { _count, _sum } = await prisma.statusCheck.aggregate({
        where: {
          websiteId: website.id,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
        _count: { id: true }, // Total checks
        _sum: { isUp: true }, // Count of successful checks
      });

      const totalChecks = _count.id;
      const uptimeCount = _sum.isUp || 0;
      const downtimeCount = totalChecks - uptimeCount;
      const uptimePercentage = totalChecks
        ? ((uptimeCount / totalChecks) * 100).toFixed(2)
        : 0;

      // Save aggregated data
      await prisma.websiteDailySummary.upsert({
        where: {
          websiteId_date: {
            websiteId: website.id,
            date: utcDate,
          },
        },
        update: {
          uptimeCount,
          downtimeCount,
          uptimePercentage: parseFloat(uptimePercentage),
        },
        create: {
          websiteId: website.id,
          date: utcDate,
          uptimeCount,
          downtimeCount,
          uptimePercentage: parseFloat(uptimePercentage),
        },
      });

      // Delete individual status checks older than 24 hours
      await prisma.statusCheck.deleteMany({
        where: {
          websiteId: website.id,
          createdAt: {
            lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Older than 24 hours
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
// Cron job to delete individual status checks older than 10 minutes

// ----------------------MVP----------------------------------------------------------------------------
// progrma should check website every 5mins if the website is active with the cron job
// if the websiste is down sends email to owner of the website with details as to why the webite is down
// daily sumaary of how to website performed in terms of how many when it was down and when it came back up
// ----------------------MVP-------------------------------------------------------------------------------
