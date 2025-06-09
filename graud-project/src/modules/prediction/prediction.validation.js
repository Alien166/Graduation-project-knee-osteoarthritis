import Joi from 'joi'

export const validatePrediction = (req, res, next) => {
  const schema = Joi.object({
    imagePath: Joi.string().required().messages({
      'string.empty': 'Image path is required',
      'any.required': 'Image path is required',
    }),
  })

  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }))
    return res.status(400).json({ errors })
  }

  next()
}

export const validateHistoryQuery = (req, res, next) => {
  const schema = Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10),
    skip: Joi.number().integer().min(0).default(0),
  })

  const { error } = schema.validate(req.query, { abortEarly: false })
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }))
    return res.status(400).json({ errors })
  }

  next()
}

export const validatePredictionId = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.hex': 'Invalid prediction ID format',
      'string.length': 'Invalid prediction ID length',
      'any.required': 'Prediction ID is required',
    }),
  })

  const { error } = schema.validate(
    { id: req.params.id },
    { abortEarly: false }
  )
  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }))
    return res.status(400).json({ errors })
  }

  next()
}
