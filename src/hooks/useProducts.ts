import { useState, useEffect, useCallback } from 'react';
import productService, { type Product } from '../services/productService';

interface UseProductsOptions {
  limit?: number;
  category_id?: number;
  autoFetch?: boolean;
}

export const useProducts = ({
  limit = 10,
  category_id,
  autoFetch = true
}: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await productService.getPaginated(
        page,
        limit,
        searchQuery,
        category_id
      );

      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat produk');
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchQuery, category_id]);

  // ✅ FETCH DATA
  useEffect(() => {
    if (!autoFetch) return;

    // Cegah page invalid
    if (page > totalPages && totalPages > 0) {
      setPage(1);
      return;
    }

    fetchProducts();
  }, [fetchProducts, autoFetch, page, totalPages]);

  // ✅ RESET PAGE SAAT SEARCH BERUBAH
  useEffect(() => {
    setPage(1);
  }, [searchQuery, category_id]);

  const refresh = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages,
    total,
    refresh
  };
};
