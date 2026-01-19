export interface Product {
    id: string
    name: string
    price: number
    description: string
    image_url: string
}

export interface CartItem {
    product_id: string
    quantity: number
}

export interface Cart {
    id: string
    items: CartItem[]
    created_at: string
}

export interface Order {
    id: string
    cart_id: string
    items: CartItem[]
    subtotal: number
    discount_amount: number
    total: number
    discount_code_used: string | null
    created_at: string
}

export interface DiscountCodeInfo {
    code: string
    order_number: number
    is_used: boolean
    created_at: string
}

export interface Statistics {
    total_orders: number
    total_items_purchased: number
    total_purchase_amount: number
    total_discount_amount: number
    nth_order_value: number
    discount_codes: DiscountCodeInfo[]
}

export interface Message {
    type: 'success' | 'error' | ''
    text: string
}

export interface CheckoutRequest {
    cart_id: string
    discount_code?: string | null
}
