import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth-middleware.js";
// import router from './routes.js'

router.get("/welcome", authMiddleware, (req, res) => {
  res.send("Welcome to the Home Page");
});

export default router;
