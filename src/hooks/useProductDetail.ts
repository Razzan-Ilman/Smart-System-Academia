// hooks/useProductDetail.ts
import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import type { Product } from "../services/productService";

export const useProductDetail = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) {
      setError("ID produk tidak valid");
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await productService.getById(id);
      setProduct(data);
      setMainImage(data.images?.[0] ?? null);
      setError(null);

      // Fetch related products
      await fetchRelatedProducts(data);
    } catch (err) {
      console.error("Fetch detail error:", err);
      setError("Gagal memuat detail produk");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (currentProduct: Product) => {
    try {
      const result = await productService.getPaginated(
        1,
        4,
        undefined,
        currentProduct.category_id
      );

      const related = (result.data || [])
        .filter((p: Product) => p.id !== currentProduct.id)
        .slice(0, 3);

      setRelatedProducts(related);
    } catch (err) {
      console.error("Failed to fetch related products:", err);
    }
  };

  return {
    product,
    mainImage,
    setMainImage,
    loading,
    error,
    relatedProducts,
    refresh: fetchProduct
  };
};