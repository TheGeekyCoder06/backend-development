import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/dbConfig.js";
import router from './routes/routes.js'
import homeRouter from './routes/home-routes.js'
import adminRouter from './routes/admin-routes.js'
import image from './routes/image-routes.js'
const app = express();

// Database connection
connectDB();

// Built-in middleware
app.use(express.json());
app.use('/api/auth', router);
app.use('/api/home', homeRouter);
app.use('/api/admin', adminRouter);
app.use('/api/images', image);

// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
