import { useState, useEffect } from 'react'
import type { Product, Cart, Message } from '../types'
import { productApi, cartApi, checkoutApi } from '../services/api'

export const useCart = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<Message>({ type: '', text: '' })

    useEffect(() => {
        loadProducts()
        createCart()
    }, [])

    const loadProducts = async () => {
        try {
            const res = await productApi.getAll()
            setProducts(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error loading products:', error)
            setLoading(false)
        }
    }

    const createCart = async () => {
        try {
            const res = await cartApi.create()
            setCart(res.data)
        } catch (error) {
            console.error('Error creating cart:', error)
        }
    }

    const addToCart = async (productId: string) => {
        if (!cart) return

        try {
            const res = await cartApi.addItem(cart.id, {
                product_id: productId,
                quantity: 1
            })
            setCart(res.data.cart)
            setMessage({ type: 'success', text: 'Item added to cart!' })
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add item to cart' })
        }
    }

    const removeFromCart = async (productId: string) => {
        if (!cart) return

        try {
            const res = await cartApi.removeItem(cart.id, productId)
            setCart(res.data.cart)
        } catch (error) {
            console.error('Error removing from cart:', error)
        }
    }

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (!cart) return

        try {
            const res = await cartApi.updateItemQuantity(cart.id, productId, newQuantity)
            setCart(res.data.cart)
        } catch (error) {
            console.error('Error updating quantity:', error)
        }
    }

    const checkout = async (discountCode: string) => {
        if (!cart) return

        try {
            const res = await checkoutApi.checkout({
                cart_id: cart.id,
                discount_code: discountCode || null
            })

            setMessage({
                type: 'success',
                text: `Order placed successfully! Total: $${res.data.total.toFixed(2)}`
            })

            await createCart()

            setTimeout(() => setMessage({ type: '', text: '' }), 5000)
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Checkout failed'
            })
        }
    }

    const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

    return {
        products,
        cart,
        loading,
        message,
        setMessage,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkout
    }
}
