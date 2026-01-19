import { useState, useEffect } from 'react'
import type { Cart, Product, DiscountCodeInfo } from '../../types'
import { CartItem } from './CartItem'
import { ShoppingCart, X, Tag, Check, AlertCircle } from 'lucide-react'
import { adminApi } from '../../services/api'

interface CartModalProps {
    cart: Cart | null
    products: Product[]
    isOpen: boolean
    onClose: () => void
    onUpdateQuantity: (productId: string, newQuantity: number) => void
    onRemoveItem: (productId: string) => void
    onCheckout: (discountCode: string) => void
}

export const CartModal = ({
    cart,
    products,
    isOpen,
    onClose,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout
}: CartModalProps) => {
    const [discountCode, setDiscountCode] = useState('')
    const [appliedCode, setAppliedCode] = useState<string | null>(null)
    const [couponError, setCouponError] = useState<string | null>(null)
    const [availableCodes, setAvailableCodes] = useState<DiscountCodeInfo[]>([])

    useEffect(() => {
        if (isOpen) {
            fetchAvailableCodes()
            setDiscountCode('')
            setAppliedCode(null)
            setCouponError(null)
        }
    }, [isOpen])

    const fetchAvailableCodes = async () => {
        try {
            const res = await adminApi.getStatistics()
            const unused = res.data.discount_codes.filter(code => !code.is_used)
            setAvailableCodes(unused)
        } catch (error) {
            console.error('Error fetching discount codes:', error)
        }
    }

    const handleApplyCoupon = () => {
        if (!discountCode.trim()) {
            setCouponError('Please enter a code')
            return
        }

        const isValid = availableCodes.some(c => c.code === discountCode.trim())

        if (isValid) {
            setAppliedCode(discountCode.trim())
            setCouponError(null)
        } else {
            setAppliedCode(null)
            setCouponError('Invalid coupon code')
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedCode(null)
        setDiscountCode('')
        setCouponError(null)
    }

    if (!isOpen) return null

    const getCartTotal = () => {
        if (!cart || !cart.items.length) return 0
        return cart.items.reduce((total, item) => {
            const product = products.find(p => p.id === item.product_id)
            return total + (product?.price || 0) * item.quantity
        }, 0)
    }

    const handleCheckout = () => {
        onCheckout(appliedCode || '')
        setDiscountCode('')
        setAppliedCode(null)
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <ShoppingCart size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Shopping Cart
                    </h2>
                    <button className="btn btn-secondary" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    {!cart || cart.items.length === 0 ? (
                        <p className="loading">Your cart is empty</p>
                    ) : (
                        <>
                            {cart.items.map(item => {
                                const product = products.find(p => p.id === item.product_id)
                                if (!product) return null
                                return (
                                    <CartItem
                                        key={item.product_id}
                                        item={item}
                                        product={product}
                                        onUpdateQuantity={onUpdateQuantity}
                                        onRemove={onRemoveItem}
                                    />
                                )
                            })}

                            <div style={{ marginTop: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    Discount Code
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Enter discount code"
                                        value={discountCode}
                                        onChange={(e) => {
                                            setDiscountCode(e.target.value)
                                            setCouponError(null)
                                        }}
                                        style={{ flex: 1 }}
                                        disabled={!!appliedCode}
                                    />
                                    {!appliedCode ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleApplyCoupon}
                                            disabled={!discountCode.trim()}
                                        >
                                            Apply
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleRemoveCoupon}
                                            title="Remove discount code"
                                            style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                {couponError && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--error)',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <AlertCircle size={14} />
                                        {couponError}
                                    </p>
                                )}

                                {appliedCode && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--success)',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontWeight: '600'
                                    }}>
                                        <Check size={14} />
                                        Coupon applied: 10% off
                                    </p>
                                )}

                                {availableCodes.length > 0 && !appliedCode && !couponError && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--primary)',
                                        marginTop: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <Tag size={14} />
                                        {availableCodes.length} discount code{availableCodes.length > 1 ? 's' : ''} available: {availableCodes[0].code}
                                    </p>
                                )}
                            </div>

                            <div className="order-summary">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${getCartTotal().toFixed(2)}</span>
                                </div>
                                {appliedCode && (
                                    <div className="summary-row" style={{ color: 'var(--success)' }}>
                                        <span>Discount (10%)</span>
                                        <span>-${(getCartTotal() * 0.1).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="summary-row summary-total">
                                    <span>Total</span>
                                    {appliedCode ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                            <span style={{
                                                fontSize: '0.9rem',
                                                textDecoration: 'line-through',
                                                color: 'var(--text-secondary)',
                                                fontWeight: 'normal'
                                            }}>
                                                ${getCartTotal().toFixed(2)}
                                            </span>
                                            <span>${(getCartTotal() * 0.9).toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span>${getCartTotal().toFixed(2)}</span>
                                    )}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleCheckout}
                                style={{ width: '100%', marginTop: '1rem' }}
                            >
                                Checkout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
