import express from 'express';
import authMiddleware from '../middleware/auth-middleware.js';
import isAdminUser from '../middleware/admin-middleware.js';
import { uploadImage , getAllImages} from '../controllers/image-controller.js';
import upload from '../middleware/upload-middleware.js';
const router = express.Router();

// Route to handle image upload
router.post("/upload",authMiddleware , isAdminUser , upload.single('image'), uploadImage);
// Route to get all images
router.get("/get" , authMiddleware , getAllImages);

export default router;