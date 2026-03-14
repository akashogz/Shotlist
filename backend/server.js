import express from "express";
import connectDB from "./config/mongodb.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { register } from "./controllers/auth.controller.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import likeRoutes from "./routes/like.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://shotlist-og.vercel.app",
  "https://shotlist.uk",
  "https://www.shotlist.uk"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/movie", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
