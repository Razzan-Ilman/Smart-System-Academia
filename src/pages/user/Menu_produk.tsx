import { useState } from 'react';
import SearchBar from '../../components/user/SearchBar';
import ProductCard from '../../components/user/ProductCard'; // pastikan ini sudah ada

const Menu_produk = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    { id: 1, title: 'Judul Produk', category: 'Kelas Produk', price: 'IDR 1.000.000', image: 'https://picsum.photos/400/300?random=1' },
    { id: 2, title: 'Judul Produk', category: 'Kelas Produk', price: 'IDR 1.000.000', image: 'https://picsum.photos/400/300?random=2' },
    { id: 3, title: 'Judul Produk', category: 'Kelas Produk', price: 'IDR 1.000.000', image: 'https://picsum.photos/400/300?random=3' },
    { id: 4, title: 'Judul Produk', category: 'Kelas Produk', price: 'IDR 1.000.000', image: 'https://picsum.photos/400/300?random=4' },
  ];

  return (
    <section className="relative z-10 px-6 sm:px-8 py-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h2 id="produk" className="text-4xl font-bold text-gray-900">
          Produk Kami
        </h2>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Grid / Slider */}
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            category={product.category}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden overflow-x-auto flex gap-4 snap-x snap-mandatory scrollbar-none">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[80%] sm:w-[60%] snap-start">
            <ProductCard
              title={product.title}
              category={product.category}
              price={product.price}
              image={product.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu_produk;
