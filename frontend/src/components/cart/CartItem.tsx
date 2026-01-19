import { type Product, type CartItem as CartItemType } from '../../types'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface CartItemProps {
    item: CartItemType
    product: Product
    onUpdateQuantity: (productId: string, newQuantity: number) => void
    onRemove: (productId: string) => void
}

export const CartItem = ({ item, product, onUpdateQuantity, onRemove }: CartItemProps) => {
    const handleIncrement = () => {
        onUpdateQuantity(item.product_id, item.quantity + 1)
    }

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.product_id, item.quantity - 1)
        } else {
            onRemove(item.product_id)
        }
    }

    return (
        <div className="cart-item">
            <img src={product.image_url} alt={product.name} className="cart-item-image" />
            <div className="cart-item-info">
                <h4>{product.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    ${product.price.toFixed(2)} each
                </p>
                <p style={{ fontWeight: '600', color: 'var(--primary)' }}>
                    ${(product.price * item.quantity).toFixed(2)}
                </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.25rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={handleDecrement}
                        style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                        title={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                    >
                        {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '600' }}>
                        {item.quantity}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={handleIncrement}
                        style={{ padding: '0.25rem 0.5rem', minWidth: 'auto' }}
                        title="Increase quantity"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}
