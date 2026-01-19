import { ShoppingCart, ShoppingBag, BarChart3 } from 'lucide-react'

interface HeaderProps {
    showAdmin: boolean
    cartItemCount: number
    onToggleAdmin: () => void
    onOpenCart: () => void
}

export const Header = ({ showAdmin, cartItemCount, onToggleAdmin, onOpenCart }: HeaderProps) => {
    return (
        <header className="header">
            <div className="logo">
                <ShoppingBag size={28} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Ecommerce Store
            </div>
            <nav className="nav">
                <button className="btn btn-secondary" onClick={onToggleAdmin}>
                    {showAdmin ? (
                        <>
                            <ShoppingBag size={18} />
                            Shop
                        </>
                    ) : (
                        <>
                            <BarChart3 size={18} />
                            Admin
                        </>
                    )}
                </button>
                {!showAdmin && (
                    <button className="btn btn-primary cart-badge" onClick={onOpenCart}>
                        <ShoppingCart size={18} />
                        Cart
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </button>
                )}
            </nav>
        </header>
    )
}
