import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/dbConfig.js";

const app = express();

// Database connection
connectDB();

// Built-in middleware
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
