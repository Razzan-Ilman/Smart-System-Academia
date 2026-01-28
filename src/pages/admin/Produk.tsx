import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { productService } from "../../services/productService"; // pakai service baru
import type { Product as APIProduct } from "../../services/productService";
import { useDebounce } from "../../hooks/useDebounce";

interface Product {
  id: string;
  image: string; // Thumbnail utama
  title: string;
  name: string;
  price: string;
  priceValue: number;
  date: string;
  stock: number;
}

const ITEMS_PER_PAGE = 20;

export default function AdminProduk() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState<string>("Default");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search to reduce API calls
  const debouncedSearch = useDebounce(search, 500);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();

      const transformedProducts = data.map((product: APIProduct) => {
        // ambil image utama -> fallback ke images[0] -> fallback placeholder
        const imageUrl =
          product.image?.trim() ||
          product.images?.[0]?.trim() ||
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";

        return {
          id: product.id || "",
          image: imageUrl,
          title: product.name,
          name: product.name,
          price: `Rp ${product.price.toLocaleString("id-ID")}`,
          priceValue: product.price,
          stock: product.stock || 0,
          date:
            (product as any).created_at ??
            (product as any).createdAt ??
            "",
        };
      });

      setProducts(transformedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Gagal memuat produk");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleting(true);
      await productService.delete(productToDelete);
      setProducts(products.filter((p) => p.id !== productToDelete));
      toast.success("Produk berhasil dihapus");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Sort with memoization for performance
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => p.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .sort((a, b) => {
        if (sortType === "Harga Terendah") return a.priceValue - b.priceValue;
        if (sortType === "Harga Tertinggi") return b.priceValue - a.priceValue;
        if (sortType === "Terbaru")
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortType === "Terlama")
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        return 0;
      });
  }, [products, debouncedSearch, sortType]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortType]);

  const sortOptions = [
    "Default",
    "Harga Terendah",
    "Harga Tertinggi",
    "Terbaru",
    "Terlama",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-sm border border-gray-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <ShoppingOutlined className="text-xl md:text-2xl" />
          <h1 className="text-xl md:text-2xl font-bold">Produk</h1>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Filter & Search */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`px-4 md:px-6 py-2 border border-gray-200 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm text-sm md:text-base whitespace-nowrap ${sortType !== "Default"
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FilterOutlined />{" "}
                <span className="hidden sm:inline">
                  {sortType === "Default" ? "Filter" : sortType}
                </span>
                <span className="sm:hidden">Filter</span>
              </button>

              {showFilter && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 transition-all">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortType(option);
                        setShowFilter(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative group flex-1">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ketik...."
                className="pl-4 pr-10 py-2 bg-[#f3f4f9] rounded-full w-full focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all shadow-inner text-sm md:text-base"
              />
              <SearchOutlined className="absolute right-4 top-2.5 md:top-3 text-gray-400 group-hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/produk/tambah")}
            className="px-4 md:px-6 py-2 bg-[#2ecc71] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#27ae60] transition shadow-md active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            + Tambah
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="grid grid-cols-12 bg-[#c9d4fb] font-bold p-3 text-gray-800">
            <div className="col-span-1 pl-4">No</div>
            <div className="col-span-2">Gambar</div>
            <div className="col-span-4">Judul Produk</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-1">Stok</div>
            <div className="col-span-1 text-center">Edit</div>
            <div className="col-span-1 text-center">Hapus</div>
          </div>

          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item, index) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center p-3 border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="col-span-1 pl-4 font-bold">{globalIndex}</div>
                  <div className="col-span-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100"
                      onError={(e) =>
                      (e.currentTarget.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop")
                      }
                    />
                  </div>
                  <div className="col-span-4 font-bold">{item.title}</div>
                  <div className="col-span-2 font-bold">{item.price}</div>
                  <div className="col-span-1 font-medium">{item.stock}</div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => navigate(`/admin/produk/edit/${item.id}`)}
                      className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110"
                    >
                      <EditOutlined className="text-2xl" />
                    </button>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 text-gray-700 hover:text-red-500 transition hover:scale-110"
                    >
                      <DeleteOutlined className="text-2xl" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium">
              {debouncedSearch ? `Data produk "${debouncedSearch}" tidak ditemukan` : "Tidak ada produk"}
            </div>
          )}
        </div>

        {/* Mobile Card */}
        <div className="lg:hidden space-y-3">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item, index) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 flex-shrink-0">
                      {globalIndex}.
                    </span>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-100 flex-shrink-0"
                      onError={(e) =>
                      (e.currentTarget.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop")
                      }
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">{item.price}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/admin/produk/edit/${item.id}`)}
                      className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110"
                    >
                      <EditOutlined className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 text-gray-700 hover:text-red-500 transition hover:scale-110"
                    >
                      <DeleteOutlined className="text-lg" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
              {debouncedSearch ? `Data produk "${debouncedSearch}" tidak ditemukan` : "Tidak ada produk"}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredAndSortedProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)} dari {filteredAndSortedProducts.length} produk
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, idx, arr) => (
                    <div key={page} className="flex items-center gap-1">
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition text-sm ${currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Produk?"
        confirmText="Ya, Hapus"
        isLoading={deleting}
      />
    </div>
  );
}
