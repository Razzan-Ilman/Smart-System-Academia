import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { categoryService } from "../../services/adminService";
import type { Category as APICategory } from "../../services/adminService";
import { useDebounce } from "../../hooks/useDebounce";
import Pagination from "../../components/admin/Pagination";

interface Category {
  id: number;
  name: string;
}

const ITEMS_PER_PAGE = 10;

export default function KategoriProdukContent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search to reduce filtering overhead
  const debouncedSearch = useDebounce(search, 500);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data: APICategory[] = await categoryService.getAll();

      // Transform API data to match UI format
      const transformedCategories = data.map((category) => ({
        id: category.id || 0,
        name: category.name
      }));

      setCategories(transformedCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Gagal memuat kategori');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete !== null) {
      try {
        setDeleting(true);
        await categoryService.delete(categoryToDelete);

        // Update local state
        const updatedCategories = categories.filter((c: Category) => c.id !== categoryToDelete);
        setCategories(updatedCategories);

        toast.success('Kategori berhasil dihapus');
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Failed to delete category:', error);
        toast.error('Gagal menghapus kategori');
      } finally {
        setDeleting(false);
      }
    }
  };

  // Memoized filtering logic
  const filteredCategories = useMemo(() => {
    return categories.filter((item: Category) => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFilter = filterType === "Semua" || item.name === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [categories, debouncedSearch, filterType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-sm border border-gray-100 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <AppstoreOutlined className="text-xl md:text-2xl" />
          <h1 className="text-xl md:text-2xl font-bold">Kategori Produk</h1>
        </div>

        {/* Toolbar - Responsive */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          {/* Filter & Search Row */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`px-4 md:px-6 py-2 border border-gray-200 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm text-sm md:text-base whitespace-nowrap ${filterType !== "Semua" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FilterOutlined /> <span className="hidden sm:inline">{filterType === "Semua" ? "Filter" : filterType}</span>
                <span className="sm:hidden">Filter</span>
              </button>

              {showFilter && (
                <div className="absolute top-full mt-2 left-0 w-40 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  {["Semua", ...categories.map((c: Category) => c.name)].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilterType(type);
                        setShowFilter(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                    >
                      {type}
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

          {/* Tambah Button */}
          <button
            onClick={() => navigate("/admin/kategori-produk/tambah")}
            className="px-4 md:px-6 py-2 bg-[#2ecc71] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#27ae60] transition shadow-md active:scale-95 text-sm md:text-base whitespace-nowrap"
          >
            + Tambah
          </button>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden lg:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#c9d4fb] font-bold p-3 text-gray-800">
            <div className="col-span-2 pl-4">No</div>
            <div className="col-span-6">Kategori</div>
            <div className="col-span-2 text-center">Edit</div>
            <div className="col-span-2 text-center">Hapus</div>
          </div>

          {/* Table Rows */}
          {paginatedCategories.length > 0 ? (
            paginatedCategories.map((item: Category, index: number) => {
              const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center p-3 border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <div className="col-span-2 pl-4 font-bold">{globalIndex}</div>
                  <div className="col-span-6 font-bold">{item.name}</div>

                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => navigate(`/admin/kategori-produk/edit/${item.id}`)}
                      className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110 active:scale-90"
                    >
                      <EditOutlined className="text-2xl" />
                    </button>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="p-2 text-gray-700 hover:text-red-500 transition hover:scale-110 active:scale-90"
                    >
                      <DeleteOutlined className="text-2xl" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium">
              {debouncedSearch ? `Data kategori "${debouncedSearch}" tidak ditemukan` : "Belum ada data kategori"}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />


        </div>

        {/* Mobile Card View - Shown on Mobile/Tablet */}
        <div className="lg:hidden space-y-3">
          {/* Table Header - Mobile */}
          <div className="bg-[#c9d4fb] rounded-xl p-3 grid grid-cols-3 gap-2 font-bold text-gray-800 text-sm">
            <div>Kategori</div>
            <div className="text-center">Edit</div>
            <div className="text-center">Hapus</div>
          </div>

          {/* Category Cards */}
          {paginatedCategories.length > 0 ? (
            <>
              {paginatedCategories.map((item: Category, index: number) => {
                const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="grid grid-cols-3 gap-3 items-center">
                      {/* Category Name */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 flex-shrink-0">{globalIndex}.</span>
                        <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
                      </div>

                      {/* Edit Action */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate(`/admin/kategori-produk/edit/${item.id}`)}
                          className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110"
                        >
                          <EditOutlined className="text-lg" />
                        </button>
                      </div>

                      {/* Delete Action */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="p-2 text-gray-700 hover:text-red-500 transition hover:scale-110"
                        >
                          <DeleteOutlined className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
              {debouncedSearch ? `Data kategori "${debouncedSearch}" tidak ditemukan` : "Belum ada kategori"}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Kategori?"
        confirmText="Ya, Hapus"
        isLoading={deleting}
      />
    </div>
  );
}
