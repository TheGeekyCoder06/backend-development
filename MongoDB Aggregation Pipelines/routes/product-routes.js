import express from "express";
import {
  addProduct,
  getProductStats,
  getProductAnalysis,
} from "../controllers/product-controller.js";
const router = express.Router();

router.post("/add", addProduct);
router.get("/stats", getProductStats);
router.get("/analysis", getProductAnalysis);

export default router;
