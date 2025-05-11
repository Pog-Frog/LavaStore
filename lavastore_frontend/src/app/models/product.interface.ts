export interface Category {
    id: number;
    name: string;
}

export interface DietaryPreference {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price: number;
    image_url: string;
    category_id: number;
    is_featured: boolean;
    badge: string;
    created_at: string;
    updated_at: string;
    category?: Category;
    dietary_preferences?: DietaryPreference[];
}

export interface PaginatedResponse<T> {
    message: string;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface ProductFilters {
    category?: number;
    min_price?: number;
    max_price?: number;
    dietary_preferences?: number[];
    sort_by?: string;
    page?: number;
    per_page?: number;
    is_featured?: boolean;
    badge?: string;
} 