import axios from 'axios'
import type { Product, Cart, CartItem, Order, CheckoutRequest, Statistics } from '../types'

const API_URL = '/api'

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
})

// 5-minute cache for product data
const productCache = new Map<string, { data: Product[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000

// Prevent duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<any>>()

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        // Cache product responses
        if (response.config.url === '/products') {
            productCache.set(response.config.url!, { data: response.data, timestamp: Date.now() })
        }
        return response
    },
    (error) => {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message)
        }
        return Promise.reject(error)
    }
)

export const productApi = {
    getAll: async () => {
        const cacheKey = '/products'

        // Return cached data if fresh
        const cachedData = productCache.get(cacheKey)
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return { data: cachedData.data }
        }

        // Return existing request if in flight
        if (pendingRequests.has(cacheKey)) {
            return pendingRequests.get(cacheKey)!
        }

        // Fetch and cache
        const request = api.get<Product[]>('/products').then((response) => {
            pendingRequests.delete(cacheKey)
            return response
        }).catch((error) => {
            pendingRequests.delete(cacheKey)
            throw error
        })

        pendingRequests.set(cacheKey, request)
        return request
    },
    getById: (id: string) => api.get<Product>(`/products/${id}`),
}

export const cartApi = {
    create: () => api.post<Cart>('/cart'),
    getById: (id: string) => api.get<Cart>(`/cart/${id}`),
    addItem: (cartId: string, item: CartItem) =>
        api.post(`/cart/${cartId}/items`, item),
    updateItemQuantity: (cartId: string, productId: string, quantity: number) =>
        api.put(`/cart/${cartId}/items/${productId}`, null, { params: { quantity } }),
    removeItem: (cartId: string, productId: string) =>
        api.delete(`/cart/${cartId}/items/${productId}`),
}

export const checkoutApi = {
    checkout: (request: CheckoutRequest) =>
        api.post<Order>('/checkout', request),
    getOrders: () => api.get<Order[]>('/orders'),
    getOrderById: (id: string) => api.get<Order>(`/orders/${id}`),
}

export const adminApi = {
    getStatistics: () => api.get<Statistics>('/admin/statistics'),
    generateDiscount: () => api.post('/admin/generate-discount'),
}
