import express from 'express'
import {registerController , loginController , changePassword} from "../controllers/controller.js"
import authMiddleware from '../middleware/auth-middleware.js'
const router = express.Router();

// all routes are related to authentication and authorization
router.post('/register' , registerController)
router.post('/login' , loginController)
router.post('/change-password' , authMiddleware , changePassword)


export default router