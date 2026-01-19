import type { Message } from '../../types'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

interface ToastProps {
    message: Message
    onClose: () => void
}

export const Toast = ({ message, onClose }: ToastProps) => {
    if (!message.text) return null

    return (
        <div className="toast-container">
            <div className={`toast ${message.type}`}>
                <div className="toast-icon">
                    {message.type === 'success' ? (
                        <CheckCircle size={24} />
                    ) : (
                        <AlertCircle size={24} />
                    )}
                </div>
                <div className="toast-content">{message.text}</div>
                <button className="toast-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}
