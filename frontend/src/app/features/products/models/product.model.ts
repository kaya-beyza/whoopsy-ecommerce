export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    discountLabel?: string;
    imageUrl: string;
    hoverImageUrl?: string;
    category: string;
    subCategory?: string;
    brand: string;
    rating: number;
    stock: number;
    isBestseller?: boolean;
    isNew?: boolean;
    slug: string;
    sizes: (string | number)[];
    colors: string[];
}

export interface FilterGroup {
    name: string;
    key: string;
    options: string[];
    isExpanded: boolean;
}
