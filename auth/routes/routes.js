import express from 'express'
import {registerController , loginController} from "../controllers/controller.js"
const router = express.Router();

// all routes are related to authentication and authorization
router.post('/register' , registerController)
router.post('/login' , loginController)


export default router