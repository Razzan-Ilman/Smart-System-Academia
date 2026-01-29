// pages/user/Menu_produk.tsx
import SearchBar from '../../components/user/SearchBar';
import ProductGrid from '../../components/user/Product/ProductGrid';
import Pagination from '../../components/user/Product/Pagination';
import ErrorMessage from '../../components/user/Product/ErrorMessage';
import LoadingMessage from '../../components/user/Product/LoadingMessage';
import EmptyState from '../../components/user/Product/EmptyState';
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

  const hasProducts = products.length > 0;
  const showPagination = !loading && totalPages > 1;

  return (
    <section id="produk" className="relative z-10 px-6 sm:px-8 py-20 max-w-7xl mx-auto">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {error && <ErrorMessage message={error} onRetry={refresh} />}
      {loading && <LoadingMessage />}
      {!loading && !error && !hasProducts && <EmptyState />}
      {!loading && !error && hasProducts && <ProductGrid products={products} />}
      {showPagination && (
        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={setPage} 
        />
      )}
    </section>
  );
};

// Komponen Header
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
    <h2 className="text-4xl font-bold text-gray-900" id="products">
      Produk Kami
    </h2>
    <SearchBar value={searchQuery} onChange={onSearchChange} />
  </div>
);

export default Menu_produk;