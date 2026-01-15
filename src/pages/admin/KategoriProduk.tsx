import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import ConfirmModal from "../../components/admin/ConfirmModal";

interface Category {
  id: number;
  name: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: "Kelas" },
  { id: 2, name: "Course" },
];

export default function KategoriProdukContent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("admin_categories");
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_CATEGORIES);
      localStorage.setItem("admin_categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
  }, []);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("Semua");
  const [showFilter, setShowFilter] = useState(false);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      const updatedCategories = categories.filter((c: Category) => c.id !== categoryToDelete);
      setCategories(updatedCategories);
      localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter((item: Category) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "Semua" || item.name === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <AppstoreOutlined className="text-2xl" />
          <h1 className="text-2xl font-bold">Kategori Produk</h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`px-6 py-2 border border-gray-200 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm ${filterType !== "Semua" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FilterOutlined /> {filterType === "Semua" ? "Filter" : filterType}
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

            <div className="relative group">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ketik...."
                className="pl-4 pr-10 py-2 bg-[#f3f4f9] rounded-full w-80 focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all shadow-inner"
              />
              <SearchOutlined className="absolute right-4 top-3 text-gray-400 group-hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/kategori-produk/tambah")}
            className="px-6 py-2 bg-[#2ecc71] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#27ae60] transition shadow-md active:scale-95"
          >
            + Tambah
          </button>
        </div>

        {/* Table Container */}
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#c9d4fb] font-bold p-3 text-gray-800">
            <div className="col-span-2 pl-4">No</div>
            <div className="col-span-6">Kategori</div>
            <div className="col-span-2 text-center">Edit</div>
            <div className="col-span-2 text-center">Hapus</div>
          </div>

          {/* Table Rows */}
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item: Category, index: number) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center p-3 border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="col-span-2 pl-4 font-bold">{index + 1}</div>
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
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 font-medium">
              Data kategori "{search || filterType}" tidak ditemukan
            </div>
          )}

          {/* Empty Rows for Aesthetic */}
          {filteredCategories.length < 5 &&
            Array.from({ length: 5 - filteredCategories.length }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 p-5 border-t border-gray-100 opacity-50">
                <div className="col-span-12 h-4"></div>
              </div>
            ))
          }
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Kategori?"
        confirmText="Ya, Hapus"
      />
    </div>
  );
}
