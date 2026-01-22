import { useEffect, useState } from 'react';
import SearchBar from '../../components/user/SearchBar';
import ProductGrid from '../../components/user/ProductGrid';

type ApiProduct = {
  id: number;
  name: string;
  price: number;
  images?: string[];
  category_id?: number;
};

const Menu_produk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('https://ssa-payment.lskk.co.id/api/v1/product')
    .then(res => res.json())
    .then(res => {
      console.log('API RESPONSE:', res); // 🔍 PENTING
      const safeData = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setProducts(safeData);
    })
    .catch(err => {
      console.error('Fetch products error:', err);
      setProducts([]);
    })
    .finally(() => setLoading(false));
}, []);

  const mappedProducts = products.map(product => ({
    id: product.id,
    title: product.name,
    category: `Kategori ${product.category_id ?? '-'}`,
    price: `IDR ${product.price.toLocaleString('id-ID')}`,
    image: product.images?.[0],
  }));

  const filteredProducts = mappedProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative z-10 px-6 sm:px-8 py-20 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h2 id="produk" className="text-4xl font-bold text-gray-900">
          Produk Kami
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">
          Memuat produk...
        </p>
      )}

      {/* Empty */}
      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500">
          Produk tidak ditemukan
        </p>
      )}

      {/* 🔥 ProductGrid */}
      {!loading && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}
    </section>
  );
};

export default Menu_produk;
