import SearchBar from '../../components/user/SearchBar';
import ProductGrid from '../../components/user/ProductGrid';
import { useProducts } from '../../hooks/useProducts';

const Menu_produk = () => {
  const {
    products,
    loading,
    error,
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    totalPages,
    refresh
  } = useProducts({ limit: 10 });

  return (
    <section id="produk" className="relative z-10 px-6 sm:px-8 py-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h2 className="text-4xl font-bold text-gray-900" id="products">
          Produk Kami
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {error && (
        <div className="text-center my-10">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {loading && <p className="text-center text-gray-500">Memuat produk...</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">Produk tidak ditemukan</p>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductGrid products={products} />
      )}

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
              className={`px-4 py-2 rounded-lg ${page === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200'
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
