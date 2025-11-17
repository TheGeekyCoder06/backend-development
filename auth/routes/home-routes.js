import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth-middleware.js";
import {getAllUsersController} from "../controllers/controller.js";
import isAdminUser from "../middleware/admin-middleware.js";
// import router from './routes.js'

router.get("/welcome", authMiddleware, (req, res) => {
  res.send("Welcome to the Home Page");
});

router.get("/get-users", authMiddleware ,  isAdminUser , getAllUsersController);

export default router;
