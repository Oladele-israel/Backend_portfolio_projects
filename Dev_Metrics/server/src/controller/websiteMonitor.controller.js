import { PrismaClient } from "@prisma/client";
import { pingWebsite } from "../utils/checkWebsite.js";
const prisma = new PrismaClient();

// a controller that gets and saves the weburl on the database and then starts the monitoring
export const monitor = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id;

  console.log("this is the userid --->", userId);

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

// import axios from "axios";
// import nodemailer from "nodemailer";
// import prisma from "../prisma"; // Ensure this is correctly imported

// export const pingWebsite = async (url, userId) => {
//   const startTime = Date.now();

//   try {
//     const response = await axios.get(url);

//     // Calculate response time
//     const responseTime = Date.now() - startTime;
//     const responseTimeSec = parseFloat((responseTime / 1000).toFixed(3));

//     // Create or connect to the website and record the check
//     const check = await prisma.statusCheck.create({
//       data: {
//         website: {
//           connectOrCreate: {
//             where: { url },
//             create: { url, userId },
//           },
//         },
//         statusCode: response.status,
//         responseTime: responseTimeSec,
//         error: null,
//         isUp: true,
//       },
//     });

//     return {
//       isUp: true,
//       responseTime: responseTime,
//       response_secs: `${responseTimeSec} secs`,
//       statusCode: check.statusCode,
//     };
//   } catch (error) {
//     // Create status check entry for downtime
//     const check = await prisma.statusCheck.create({
//       data: {
//         website: {
//           connectOrCreate: {
//             where: { url },
//             create: { url, userId },
//           },
//         },
//         statusCode: error.response?.status || 500,
//         responseTime: -1,
//         error: error.message || "Unknown error",
//         isUp: false,
//       },
//     });

//     // Fetch user email
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { email: true },
//     });

//     if (user?.email) {
//       await sendDowntimeEmail(user.email, url, check.error);
//     }

//     return {
//       isUp: false,
//       responseTime: check.responseTime,
//       statusCode: check.statusCode,
//       error: check.error,
//     };
//   }
// };

// // Function to send an email when the website is down
// const sendDowntimeEmail = async (userEmail, websiteUrl, errorMessage) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//     });

//     const mailOptions = {
//       from: `"Website Monitor" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `🚨 Website Down Alert: ${websiteUrl}`,
//       html: `
//         <h2>Alert: Website is Down!</h2>
//         <p>The website <strong>${websiteUrl}</strong> is currently unreachable.</p>
//         <p><strong>Error Message:</strong> ${errorMessage}</p>
//         <p>Please check your website's status.</p>
//         <br />
//         <p>Best regards,<br>Website Monitoring Service</p>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${userEmail} about ${websiteUrl} being down.`);
//   } catch (error) {
//     console.error("Error sending downtime email:", error);
//   }
// };
