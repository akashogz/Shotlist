import express from "express";
import connectDB from "./config/mongodb.js";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import { register } from "./controllers/auth.controller.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

configDotenv()

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
