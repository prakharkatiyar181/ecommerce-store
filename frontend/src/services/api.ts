import axios from 'axios'
import type { Product, Cart, CartItem, Order, Statistics, CheckoutRequest } from '../types'

const API_URL = 'http://localhost:8000'

const api = axios.create({
    baseURL: API_URL,
})

export const productApi = {
    getAll: () => api.get<Product[]>('/products'),
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
