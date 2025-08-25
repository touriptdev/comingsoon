// backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----- ES module __dirname fix -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----- Middleware -----
app.use(express.json({ limit: "10mb" }));

// CORS configuration for production and development
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite default port
  process.env.FRONTEND_URL,
  // Add your Render frontend URL here when you get it
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // In production, log the origin for debugging
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----- MongoDB Connection -----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// ----- Email Schema -----
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

const Email = mongoose.model("Email", emailSchema);

// ----- API Routes -----
app.post("/api/emails", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const existing = await Email.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const newEmail = new Email({ email: email.toLowerCase() });
    await newEmail.save();

    res.status(201).json({
      success: true,
      message: "Email saved successfully",
    });
  } catch (error) {
    console.error("Error saving email:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

// Get emails count (optional - for admin use)
app.get("/api/emails/count", async (req, res) => {
  try {
    const count = await Email.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error getting email count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ----- Serve Frontend in Production -----
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Catch all handler: send back React's index.html file for any non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ----- Error handling middleware -----
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// ----- Start Server -----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});
