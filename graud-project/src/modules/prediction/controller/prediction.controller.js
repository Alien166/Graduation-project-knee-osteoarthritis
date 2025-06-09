import { PythonShell } from 'python-shell'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import Prediction from '../../../../db/models/prediction.model.js'
import { apiFeatures } from '../../../utils/apiFeatures.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the graud-project directory path
const projectDir = path.resolve(__dirname, '../../../../../')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(projectDir, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('Created uploads directory at:', uploadsDir)
}

// Run prediction using Python script
const runPrediction = (imagePath) => {
  const options = {
    mode: 'text',
    pythonPath: 'C:/Users/Mohamed/miniconda3/envs/Knee_dl_app/python.exe',
    pythonOptions: ['-u'],
    scriptPath: projectDir,
    args: [imagePath],
    stderrParser: (line) => {
      console.log('Python stderr:', line)
      return line
    },
  }

  console.log(
    'Running Python script from:',
    path.join(projectDir, 'predict.py')
  )
  console.log('With image path:', imagePath)

  return new Promise((resolve, reject) => {
    PythonShell.run('predict.py', options)
      .then((results) => {
        if (!results || results.length === 0) {
          reject(new Error('No output from Python script'))
          return
        }

        try {
          const jsonOutput = results[results.length - 1]
          console.log('Python script JSON output:', jsonOutput)
          const prediction = JSON.parse(jsonOutput)
          resolve(prediction)
        } catch (parseError) {
          console.error('Error parsing Python output:', parseError)
          console.error('Raw output was:', results)
          reject(new Error('Error parsing prediction results'))
        }
      })
      .catch((error) => {
        console.error('Python script error:', error)
        reject(error)
      })
  })
}

// Controller functions
export const predict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        details: 'Please upload an image file',
      })
    }

    const userId = req.user._id
    const uploadedFile = req.file

    // Run prediction with the uploaded file path
    const prediction = await runPrediction(uploadedFile.path)
    console.log('Prediction result:', {
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      hasHeatmap: !!prediction.heatmap_image,
      heatmapLength: prediction.heatmap_image
        ? prediction.heatmap_image.length
        : 0,
    })

    // Save to database with the filename and heatmap image
    const predictionDoc = new Prediction({
      imagePath: uploadedFile.filename,
      heatmap_image: prediction.heatmap_image, // Save the base64 encoded heatmap image
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      probabilities: prediction.probabilities,
      userId,
    })

    await predictionDoc.save()
    console.log('Prediction saved to database:', {
      id: predictionDoc._id,
      hasHeatmap: !!predictionDoc.heatmap_image,
      heatmapLength: predictionDoc.heatmap_image
        ? predictionDoc.heatmap_image.length
        : 0,
    })

    // Verify the saved document
    const savedDoc = await Prediction.findById(predictionDoc._id).select(
      '+heatmap_image'
    )
    console.log('Verified saved document:', {
      id: savedDoc._id,
      hasHeatmap: !!savedDoc.heatmap_image,
      heatmapLength: savedDoc.heatmap_image ? savedDoc.heatmap_image.length : 0,
    })

    // Return response with image URL and heatmap
    res.json({
      ...prediction,
      predictionId: predictionDoc._id,
      imagePath: uploadedFile.filename,
    })
  } catch (error) {
    console.error('Prediction error:', error)
    res.status(500).json({
      error: 'Error running prediction',
      details: error.message,
    })
  }
}

export const getHistory = async (req, res) => {
  try {
    const userId = req.user._id // Get userId from the token

    // Create base query with user filter
    const baseQuery = Prediction.find({ userId })

    // Apply apiFeatures
    const features = new apiFeatures(baseQuery, req.query)
      .filter()
      .sort()
      .fields()
      .search()
      .pagination()

    // Execute query
    const predictions = await features.mongooseQuery

    // Get total count for pagination
    const total = await Prediction.countDocuments({ userId })

    res.json({
      predictions,
      total,
      hasMore: total > features.pageNumber * features.pageLimit,
      page: features.pageNumber,
      size: features.pageLimit,
      totalPages: Math.ceil(total / features.pageLimit),
    })
  } catch (error) {
    console.error('Error fetching prediction history:', error)
    res.status(500).json({ error: 'Error fetching prediction history' })
  }
}

export const getPrediction = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id // Get userId from the token

    console.log('Fetching prediction with ID:', id)

    const prediction = await Prediction.findOne({ _id: id, userId }).select(
      '+heatmap_image'
    )
    if (!prediction) {
      return res.status(404).json({
        error: 'Prediction not found',
        details: `No prediction found with ID: ${id}`,
      })
    }

    console.log('Found prediction:', {
      id: prediction._id,
      hasHeatmap: !!prediction.heatmap_image,
      heatmapLength: prediction.heatmap_image
        ? prediction.heatmap_image.length
        : 0,
    })

    // Convert to plain object and ensure all fields are included
    const predictionObj = prediction.toObject()

    res.json({
      ...predictionObj,
      heatmap_image: predictionObj.heatmap_image || null, // Ensure heatmap_image is included, even if null
    })
  } catch (error) {
    console.error('Error fetching prediction:', error)
    res.status(500).json({
      error: 'Error fetching prediction',
      details: error.message,
    })
  }
}

// Delete a single prediction
export const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user._id // Get userId from token

    // Find and delete the prediction, ensuring it belongs to the user
    const prediction = await Prediction.findOneAndDelete({ _id: id, userId })

    if (!prediction) {
      return res.status(404).json({
        error: 'Prediction not found',
        details:
          'No prediction found with this ID or you do not have permission to delete it',
      })
    }

    res.json({
      message: 'Prediction deleted successfully',
      prediction,
    })
  } catch (error) {
    console.error('Error deleting prediction:', error)
    res.status(500).json({
      error: 'Error deleting prediction',
      details: error.message,
    })
  }
}

// Delete all predictions for the current user
export const deleteAllPredictions = async (req, res) => {
  try {
    const userId = req.user._id // Get userId from token

    // Delete all predictions for this user
    const result = await Prediction.deleteMany({ userId })

    res.json({
      message: 'All predictions deleted successfully',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error('Error deleting all predictions:', error)
    res.status(500).json({
      error: 'Error deleting predictions',
      details: error.message,
    })
  }
}
