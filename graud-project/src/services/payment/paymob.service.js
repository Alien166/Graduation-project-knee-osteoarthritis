import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

class PaymentError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

class PaymobService {
  constructor() {
    this.apiKey = process.env.PAYMOB_API_KEY
    this.merchantId = process.env.PAYMOB_MERCHANT_ID
    this.baseUrl = 'https://accept.paymob.com/api'
  }

  async getAuthToken() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/tokens`, {
        api_key: this.apiKey,
      })
      return response.data.token
    } catch (error) {
      throw new PaymentError(
        'Failed to authenticate with payment gateway',
        'AUTH_ERROR'
      )
    }
  }

  async createOrder(amount, currency = 'EGP') {
    try {
      const authToken = await this.getAuthToken()
      const response = await axios.post(`${this.baseUrl}/ecommerce/orders`, {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100), // Convert to cents and ensure integer
        currency,
        merchant_id: process.env.PAYMOB_MERCHANT_ID,
        items: [],
      })
      return response.data
    } catch (error) {
      throw new PaymentError(
        'Failed to create payment order',
        'ORDER_CREATION_ERROR'
      )
    }
  }

  async getPaymentKey(order, integrationId, userData) {
    try {
      const authToken = await this.getAuthToken()
      const response = await axios.post(
        `${this.baseUrl}/acceptance/payment_keys`,
        {
          auth_token: authToken,
          amount_cents: order.amount_cents, // <-- order, not orderId
          expiration: 3600,
          order_id: order.id,
          billing_data: {
            email: userData.email,
            first_name: userData.name || 'NA',
            last_name: userData.name || 'NA',
            phone_number: userData.phone || 'NA',
            apartment: 'NA',
            floor: 'NA',
            street: 'NA',
            building: 'NA',
            shipping_method: 'NA',
            postal_code: 'NA',
            city: 'NA',
            country: 'NA',
            state: 'NA',
          },
          currency: 'EGP',
          integration_id: integrationId,
          callback_url:
            'https://5790-2c0f-fc89-8039-c0b-163-79d3-7f94-be6.ngrok-free.app/api/v1/payments/callback',
        }
      )
      return response.data
    } catch (error) {
      console.error('Payment key error:', error.response?.data || error.message)
      throw new PaymentError(
        'Failed to generate payment key',
        'PAYMENT_KEY_ERROR'
      )
    }
  }
}

export const paymobService = new PaymobService()
