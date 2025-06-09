import mongoose from 'mongoose'

const predictionSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
      required: true,
    },
    heatmap_image: {
      type: String,
      required: false,
      select: false, // Don't include by default in queries
    },
    prediction: {
      type: String,
      required: true,
      enum: ['Healthy', 'Doubtful', 'Minimal', 'Moderate', 'Severe'],
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    probabilities: {
      Healthy: { type: Number, required: true },
      Doubtful: { type: Number, required: true },
      Minimal: { type: Number, required: true },
      Moderate: { type: Number, required: true },
      Severe: { type: Number, required: true },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for better query performance
predictionSchema.index({ prediction: 1, createdAt: -1 })

const Prediction = mongoose.model('Prediction', predictionSchema)

export default Prediction
