import express from 'express'
const router = express.Router()
import authMiddleware from '../middleware/auth-middleware.js'
import isAdminUser from '../middleware/admin-middleware.js'
router.get('/welcome', authMiddleware, isAdminUser, (req, res) => {
  res.send('Welcome to the Admin Page')
})

export default router