import type { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface ProductGridProps {
    products: Product[]
    loading: boolean
    onAddToCart: (productId: string) => void
}

export const ProductGrid = ({ products, loading, onAddToCart }: ProductGridProps) => {
    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    )
}
