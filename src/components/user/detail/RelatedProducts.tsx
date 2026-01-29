// components/user/detail/RelatedProducts.tsx
import { Link } from "react-router-dom";
import { formatRupiah } from "../../../utils/currency";
import type { Product } from "../../../services/productService";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-50 p-6">
      <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">
        Rekomendasi Lainnya
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <RelatedProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

interface RelatedProductItemProps {
  product: Product;
}

const RelatedProductItem: React.FC<RelatedProductItemProps> = ({ product }) => {
  return (
    <Link
      to={`/produk/${product.id}`}
      className="cursor-pointer group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-all duration-300"
    >
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 relative shadow-sm group-hover:shadow-md transition-all">
        <img
          src={product.images?.[0] ?? "/no-image.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/no-image.png";
          }}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-[#7C3AED] transition-colors leading-snug">
          {product.name}
        </h4>
        <p className="text-[#7C3AED] font-bold text-xs mt-1 bg-purple-50 inline-block px-2 py-0.5 rounded-full self-start">
          {formatRupiah(product.price)}
        </p>
      </div>
    </Link>
  );
};

export default RelatedProducts;