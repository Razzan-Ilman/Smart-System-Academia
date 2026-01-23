import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { productService } from "../../services/productService";
import type { ProductWithCategory } from "../../services/productService";

// Membagi array menjadi beberapa chunk (untuk slider mobile)
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const ProductGrid = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAllWithCategory();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const slides = chunkArray(products, 4);

  if (loading) {
    return <p className="text-center text-gray-500">Memuat produk...</p>;
  }

  if (!products.length) {
    return <p className="text-center text-gray-500">Produk tidak ditemukan</p>;
  }

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id!}
            title={product.name}
            category={product.category_name}
            price={`IDR ${product.price.toLocaleString("id-ID")}`}
            image={product.image}
          />
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden overflow-x-auto scrollbar-none">
        <div className="flex gap-4 snap-x snap-mandatory px-1">
          {slides.map((slide, idx) => (
            <div key={idx} className="flex-shrink-0 w-full snap-start">
              <div className="grid grid-cols-2 gap-4">
                {slide.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id!}
                    title={product.name}
                    category={product.category_name}
                    price={`IDR ${product.price.toLocaleString("id-ID")}`}
                    image={product.image}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductGrid;
