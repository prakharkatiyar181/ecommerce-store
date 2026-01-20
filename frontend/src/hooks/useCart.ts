import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { Product, Cart, Message } from '../types'
import { productApi, cartApi, checkoutApi } from '../services/api'

// Debounce helper - prevents API spam on rapid clicks
const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: number
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay) as unknown as number
    }
}

export const useCart = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<Message>({ type: '', text: '' })

    // Refs for cleanup to prevent memory leaks
    const abortControllerRef = useRef<AbortController | null>(null)
    const messageTimeoutRef = useRef<number | null>(null)

    // Initialize: fetch products and create cart
    useEffect(() => {
        abortControllerRef.current = new AbortController()
        loadProducts()
        createCart()

        // Cleanup on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current)
            }
        }
    }, [])

    const loadProducts = useCallback(async () => {
        try {
            const res = await productApi.getAll()
            setProducts(res.data)
            setLoading(false)
        } catch (error) {
            console.error('Error loading products:', error)
            setLoading(false)
        }
    }, [])

    const createCart = useCallback(async () => {
        try {
            const res = await cartApi.create()
            setCart(res.data)
        } catch (error) {
            console.error('Error creating cart:', error)
        }
    }, [])

    const addToCart = useCallback(async (productId: string) => {
        if (!cart) return

        try {
            const res = await cartApi.addItem(cart.id, {
                product_id: productId,
                quantity: 1
            })
            setCart(res.data.cart)
            setMessage({ type: 'success', text: 'Item added to cart!' })

            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current)
            }
            messageTimeoutRef.current = setTimeout(() => {
                setMessage({ type: '', text: '' })
            }, 3000)
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to add item to cart' })
        }
    }, [cart])

    const removeFromCart = useCallback(async (productId: string) => {
        if (!cart) return

        try {
            const res = await cartApi.removeItem(cart.id, productId)
            setCart(res.data.cart)
        } catch (error) {
            console.error('Error removing from cart:', error)
        }
    }, [cart])

    const updateQuantityImmediate = useCallback(async (productId: string, newQuantity: number) => {
        if (!cart) return

        try {
            await cartApi.updateItemQuantity(cart.id, productId, newQuantity)
        } catch (error) {
            console.error('Error updating quantity:', error)
            // Refetch on error to stay synced
            if (cart) {
                const res = await cartApi.getById(cart.id)
                setCart(res.data)
            }
        }
    }, [cart])

    const debouncedUpdateQuantity = useMemo(
        () => debounce(updateQuantityImmediate, 300),
        [updateQuantityImmediate]
    )

    const updateQuantity = useCallback((productId: string, newQuantity: number) => {
        if (!cart) return

        // Update UI immediately
        setCart(prev => {
            if (!prev) return prev
            return {
                ...prev,
                items: prev.items.map(item =>
                    item.product_id === productId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            }
        })

        // Sync with server (debounced)
        debouncedUpdateQuantity(productId, newQuantity)
    }, [cart, debouncedUpdateQuantity])

    const checkout = useCallback(async (discountCode: string) => {
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

            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current)
            }
            messageTimeoutRef.current = setTimeout(() => {
                setMessage({ type: '', text: '' })
            }, 5000)
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.detail || 'Checkout failed'
            })
        }
    }, [cart, createCart])

    // Memoized cart item count
    const cartItemCount = useMemo(
        () => cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
        [cart?.items]
    )

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
