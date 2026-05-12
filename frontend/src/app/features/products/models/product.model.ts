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
    categoryId?: number | string;
    genderId?: number;
    genderLabel?: string;
    subCategory?: string;
    brand: string;
    rating: number;
    stock: number;
    isBestseller?: boolean;
    isNew?: boolean;
    createdDate?: string;
    slug: string;
    sizes: (string | number)[];
    colors: string[];
    images?: string[]; // 👈 Çoklu resim galerisi desteği
}

export interface FilterOption {
    label: string;
    value: any;
    subOptions?: FilterOption[];
    isExpanded?: boolean;
}

export interface FilterGroup {
    name: string;
    key: string;
    options: FilterOption[];
    isExpanded: boolean;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}
