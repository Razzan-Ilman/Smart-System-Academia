import React from 'react';
import ProductCard from './ProductCard';

/* =====================
   HELPER
===================== */
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

/* =====================
   TYPES
===================== */
interface Product {
  id: string;   // ✅ string
  title: string;
  category: string;
  price: string;
  image?: string;
}


interface ProductGridProps {
  products: Product[];
}

/* =====================
   COMPONENT
===================== */
const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const slides = chunkArray(products, 4);

  return (
    <>
      {/* ================= DESKTOP GRID ================= */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      {/* ================= MOBILE SLIDER (FIX CLICK) ================= */}
      <div className="md:hidden overflow-x-auto scrollbar-none">
        <div className="flex gap-4 snap-x snap-mandatory px-1">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-start"
            >
              <div className="grid grid-cols-2 gap-4">
                {slide.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    category={product.category}
                    price={product.price}
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
