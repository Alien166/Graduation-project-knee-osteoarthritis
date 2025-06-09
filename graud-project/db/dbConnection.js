import mongoose from 'mongoose'
import Prediction from './models/prediction.model.js'

export const dbConnection = () => {
  mongoose
    .connect(process.env.DB_NAME)
    .then(async () => {
      console.log('DB is Connected')

      // Create prediction collection if it doesn't exist
      try {
        const collections = await mongoose.connection.db
          .listCollections()
          .toArray()
        const predictionExists = collections.some(
          (col) => col.name === 'predictions'
        )

        if (!predictionExists) {
          await Prediction.createCollection()
          console.log('Prediction collection created')
        }
      } catch (error) {
        console.log('Error creating prediction collection:', error)
      }
    })
    .catch((err) => {
      console.log('Database connection error:', err)
    })
}
