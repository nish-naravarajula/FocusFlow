import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import taskRoutes from "./routes/tasks.js";
import passport from "passport";
import configurePassport from "./config/passport.js";

dotenv.config();

console.log("Starting server...");
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(passport.initialize());
configurePassport(passport);

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://focusflow-1-pnq8.onrender.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "FocusFlow API running" });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error("Startup error:", err);
});
