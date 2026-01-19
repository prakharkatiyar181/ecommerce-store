import type { DiscountCodeInfo } from '../../types'

interface DiscountCodeListProps {
    discountCodes: DiscountCodeInfo[]
    nthOrderValue: number
}

export const DiscountCodeList = ({ discountCodes, nthOrderValue }: DiscountCodeListProps) => {
    return (
        <div style={{ marginTop: '3rem' }}>
            <h2>Discount Codes</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Every {nthOrderValue} orders generate a discount code
            </p>
            {discountCodes.length === 0 ? (
                <p className="loading">No discount codes generated yet</p>
            ) : (
                <div className="discount-code-list">
                    {discountCodes.map(code => (
                        <div key={code.code} className="discount-code-item">
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {code.code}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Generated on order #{code.order_number}
                                </div>
                            </div>
                            <span className={code.is_used ? 'badge badge-error' : 'badge badge-success'}>
                                {code.is_used ? 'Used' : 'Available'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
