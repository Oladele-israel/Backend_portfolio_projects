import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { validateUserInput, validateLogin } from "../utils/validator.js";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// create user
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields must be entered!",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Validate user input
    const { error, value } = validateUserInput({
      name,
      email,
      password,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.error("Validation error:", errorMessages);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorMessages,
      });
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return res.status(500).json({
        success: false,
        message: "Failed to hash password",
      });
    }

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate user input
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields must be entered!",
    });
  }

  const { error, value } = validateLogin({ email, password });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({ message: errorMessages });
  }

  try {
    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      {
        access1: user.name,
        access2: user.id,
      },
      process.env.JUICE,
      {
        expiresIn: "10m",
      }
    );

    const refreshToken = jwt.sign(
      {
        access1: user.name,
        access2: user.id,
      },
      process.env.SAUCE,
      {
        expiresIn: "1d",
      }
    );

    // Set cookies
    res.cookie("Juice", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
      secure: false,
    });
    res.cookie("Sauce", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// logout function
export const logout = async (req, res) => {
  try {
    res.clearCookie("Juice");
    res.clearCookie("Sauce");
    console.log("User logged out successfully");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const validateToken = (req, res) => {
  const authUser = req.user; // Ensure `req.user` is populated by your authentication middleware
  if (!authUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token.",
    });
  }
  res.status(200).json({
    success: true,
    message: "Authorized",
    authUser: authUser,
  });
};
