import { memo, useCallback } from 'react'
import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAddToCart: (productId: string) => void
}

// Memoized product card - only re-renders if product or callback changes
const ProductCardComponent = ({ product, onAddToCart }: ProductCardProps) => {
    // Stable callback reference prevents child re-renders
    const handleClick = useCallback(() => {
        onAddToCart(product.id)
    }, [product.id, onAddToCart])

    return (
        <div className="product-card">
            <img src={product.image_url} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    style={{ width: '100%' }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}

export const ProductCard = memo(ProductCardComponent)
