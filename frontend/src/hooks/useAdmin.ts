import { useState } from 'react'
import type { Statistics } from '../types'
import { adminApi } from '../services/api'

// Admin hook - manages statistics and discount code generation
export const useAdmin = () => {
    const [statistics, setStatistics] = useState<Statistics | null>(null)

    const loadStatistics = async () => {
        try {
            const res = await adminApi.getStatistics()
            setStatistics(res.data)
        } catch (error) {
            console.error('Error loading statistics:', error)
        }
    }

    return {
        statistics,
        loadStatistics
    }
}
