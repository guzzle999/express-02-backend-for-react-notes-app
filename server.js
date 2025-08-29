import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./api/v1/users.js";
import notesRoutes from "./api/v1/notes.js";
import { connectMongo } from "./config/mongo.js";


dotenv.config()

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ], // frontend domain
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", notesRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found...");
  error.status = 404;
  next(error);
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = 3001;


(async () => {
  try {
    await connectMongo()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} ✅ 🙌`);
    });
  } catch (err) {
    console.error("❌Startup error:", err);
    process.exit(1);
  };
})();



