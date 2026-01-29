import ProductCard from "./ProductCard";
import type { Product } from "../../../services/productService";

// Membagi array menjadi beberapa chunk (untuk slider mobile)
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

interface ProductGridProps {
  products: Product[]; // ✅ Gunakan Product dari service
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products.length) {
    return <p className="text-center text-gray-500">Produk tidak ditemukan</p>;
  }

  // ✅ Transform Product → ProductCard props
  const transformedProducts = products.map((product) => ({
    id: product.id || '',
    title: product.name,        // name → title
    category: product.category,
    price: product.price,       // number (akan di-format di ProductCard)
    image: product.image,
  }));

  const slides = chunkArray(transformedProducts, 4);

  return (
    <>
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {transformedProducts.map((product) => (
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

      {/* Mobile Slider */}
      <div className="md:hidden overflow-x-auto scrollbar-none">
        <div className="flex gap-4 snap-x snap-mandatory px-1">
          {slides.map((slide, idx) => (
            <div key={idx} className="flex-shrink-0 w-full snap-start">
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