import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import {
  predict,
  getHistory,
  getPrediction,
  deletePrediction,
  deleteAllPredictions,
} from './controller/prediction.controller.js'
import { protectedRoutes } from '../auth/controller/auth.controller.js'
import { validation } from '../../middleware/validation.js'
import Joi from 'joi'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the graud-project directory path
const projectDir = path.resolve(__dirname, '../../../../')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(
  'E:',
  'knee-osteoarthritis',
  'graud-project',
  'uploads'
)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Created uploads directory at:', uploadsDir)
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  },
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Not an image! Please upload an image.'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Validation schema for file upload
const uploadSchema = Joi.object({
  image: Joi.any().required().messages({
    'any.required': 'Image file is required',
  }),
})

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Prediction routes
router.post(
  '/predict',
  protectedRoutes,
  upload.single('image'),
  validation(uploadSchema),
  predict
)
router.get('/history', protectedRoutes, getHistory)
router.get('/:id', protectedRoutes, getPrediction)
router.delete('/:id', protectedRoutes, deletePrediction)
router.delete('/', protectedRoutes, deleteAllPredictions)

export default router
