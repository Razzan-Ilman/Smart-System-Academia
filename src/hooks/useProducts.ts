import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { useDebounce } from './useDebounce';

export interface GridProduct {
    id: string;
    title: string;
    category: string;
    price: string;
    image?: string;
}

interface UseProductsParams {
    limit?: number;
}

export const useProducts = ({ limit = 10 }: UseProductsParams = {}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<GridProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await productService.getPaginated(page, limit, debouncedSearch);

            const mapped: GridProduct[] = res.data.map((p: any) => ({
                id: p.id!,
                title: p.name,
                category: p.category || "Uncategorized",
                price: `IDR ${p.price.toLocaleString('id-ID')}`,
                image: p.image,
            }));

            setProducts(mapped);
            setTotal(res.total);
        } catch (error) {
            console.error('Fetch products error:', error);
            setError('Gagal memuat data produk.');
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch]);

    // Effect for fetching on page change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Effect for resetting page on search
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const totalPages = Math.ceil(total / limit);

    return {
        products,
        loading,
        error,
        page,
        setPage,
        searchQuery,
        setSearchQuery,
        totalPages,
        refresh: fetchProducts,
    };
};
