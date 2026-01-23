import { useEffect, useState } from 'react';
import SearchBar from '../../components/user/SearchBar';
import ProductGrid from '../../components/user/ProductGrid';
import { productService } from '../../services/productService';
import type { Product } from '../../services/productService';

type GridProduct = {
  id: string; // ✅ FIX
  title: string;
  category: string;
  price: string;
  image?: string;
};

const API_LIMIT = 10; // ✅ samakan dengan API

const Menu_produk = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<GridProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  /* ================= FETCH PAGINATED ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await productService.getPaginated(page, API_LIMIT);

        const mapped: GridProduct[] = res.data.map((p: Product) => ({
          id: p.id!,
          title: p.name,
          category: `Kategori ${p.category_id}`,
          price: `IDR ${p.price.toLocaleString('id-ID')}`,
          image: p.images?.[0],
        }));

        setProducts(mapped); // ✅ JANGAN slice
        setTotal(res.total);
      } catch (error) {
        console.error('Fetch products error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  /* ================= SEARCH ================= */
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / API_LIMIT);

  /* ================= RENDER ================= */
  return (
    <section className="relative z-10 px-6 sm:px-8 py-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h2 className="text-4xl font-bold text-gray-900">
          Produk Kami
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {loading && (
        <p className="text-center text-gray-500">Memuat produk...</p>
      )}

      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500">Produk tidak ditemukan</p>
      )}

      {!loading && filteredProducts.length > 0 && (
        <ProductGrid products={filteredProducts} />
      )}

      {/* ================= PAGINATION ================= */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${
                page === i + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Menu_produk;
