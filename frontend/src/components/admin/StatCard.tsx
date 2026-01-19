import { ReactNode } from 'react'

interface StatCardProps {
    icon: ReactNode
    label: string
    value: string | number
}

export const StatCard = ({ icon, label, value }: StatCardProps) => {
    return (
        <div className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {icon}
                <div className="stat-label">{label}</div>
            </div>
            <div className="stat-value">{value}</div>
        </div>
    )
}
