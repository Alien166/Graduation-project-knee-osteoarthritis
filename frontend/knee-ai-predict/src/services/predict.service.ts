import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3000/api/v1/predictions'; // Base URL for API

export interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: {
    Healthy: number;
    Doubtful: number;
    Minimal: number;
    Moderate: number;
    Severe: number;
  };
  predictionId?: string;
  imageUrl?: string; // URL to access the saved image
}

export interface PredictionHistory {
  predictions: Array<{
    _id: string;
    imagePath: string;
    prediction: string;
    confidence: number;
    probabilities: {
      Healthy: number;
      Doubtful: number;
      Minimal: number;
      Moderate: number;
      Severe: number;
    };
    createdAt: string;
    userId: string;
    heatmap_image?: string;
  }>;
  total: number;
  hasMore: boolean;
  page: number;
  size: number;
  totalPages: number;
}

export const predictService = {
  async predictImage(imageFile: File, token: string): Promise<PredictionResult> {
    try {
      console.log('Sending image file:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'token': token,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 seconds timeout
      });

      console.log('Prediction response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Prediction error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data.error || 'Error processing image');
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response from server. Please check if the server is running.');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(error.message || 'Error sending image');
        }
      }
      throw error;
    }
  },

  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  },

  /**
   * Get prediction history with pagination
   * @param page - Current page number (starts from 1)
   * @param size - Number of items per page
   * @param token - Authentication token
   */
  async getPredictionHistory(page = 1, size = 8, token: string): Promise<PredictionHistory> {
    try {
      const response = await axios.get(`${API_URL}/history`, {
        params: {
          page,
          size
        },
        headers: {
          'token': token
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch prediction history');
      }
      throw error;
    }
  },

  async deletePrediction(id: string, token: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'token': token }
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to delete prediction');
      }
      throw error;
    }
  },

  async getPredictionById(id: string, token: string): Promise<PredictionHistory['predictions'][0]> {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { 'token': token }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch prediction details');
      }
      throw error;
    }
  }
};