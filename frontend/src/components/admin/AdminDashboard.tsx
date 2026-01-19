import type { Statistics } from '../../types'
import { StatCard } from './StatCard'
import { DiscountCodeList } from './DiscountCodeList'
import { Package, ShoppingCart, TrendingUp, Gift } from 'lucide-react'

interface AdminDashboardProps {
    statistics: Statistics | null
}

export const AdminDashboard = ({ statistics }: AdminDashboardProps) => {
    if (!statistics) return null

    return (
        <div className="container">
            <h1>Admin Dashboard</h1>
            <div className="stats-grid">
                <StatCard
                    icon={<Package size={20} style={{ color: 'var(--primary)' }} />}
                    label="Total Orders"
                    value={statistics.total_orders}
                />
                <StatCard
                    icon={<ShoppingCart size={20} style={{ color: 'var(--primary)' }} />}
                    label="Items Sold"
                    value={statistics.total_items_purchased}
                />
                <StatCard
                    icon={<TrendingUp size={20} style={{ color: 'var(--primary)' }} />}
                    label="Revenue"
                    value={`$${statistics.total_purchase_amount.toFixed(2)}`}
                />
                <StatCard
                    icon={<Gift size={20} style={{ color: 'var(--primary)' }} />}
                    label="Total Discounts"
                    value={`$${statistics.total_discount_amount.toFixed(2)}`}
                />
            </div>

            <DiscountCodeList
                discountCodes={statistics.discount_codes}
                nthOrderValue={statistics.nth_order_value}
            />
        </div>
    )
}
