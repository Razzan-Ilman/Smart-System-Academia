import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  category: string;
  price: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          category={product.category}
          price={product.price}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
