import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const generateConfirmationToken = (email) => {
  if (!process.env.TOKEN) {
    throw new Error("CONFIRMTOKEN environment variable is not set.");
  }
  return jwt.sign({ email }, process.env.TOKEN, { expiresIn: "1h" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendConfirmationEmail = async (email, token) => {
  if (!process.env.EMAIL || !process.env.PASSWORD) {
    throw new Error("Email credentials are not set in environment variables.");
  }

  const confirmationLink = `http://localhost:8000/user/confirm-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirm Your Email",
    html: `<p>Please click the following link to confirm your email: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Confirmation email sent successfully." };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send confirmation email.");
  }
};
