import express from "express";
// import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import connectDB from "./db/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import productRoutes from "./routes/product-routes.js";
import bookRoutes from "./routes/book-routes.js";

// Database connection
connectDB();

// Built-in middleware
app.use(express.json());
app.use("/products", productRoutes);
app.use("/reference", bookRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
