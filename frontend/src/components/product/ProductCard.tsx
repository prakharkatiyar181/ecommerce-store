import type { Product } from '../../types'

interface ProductCardProps {
    product: Product
    onAddToCart: (productId: string) => void
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    return (
        <div className="product-card">
            <img src={product.image_url} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button
                    className="btn btn-primary"
                    onClick={() => onAddToCart(product.id)}
                    style={{ width: '100%' }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
