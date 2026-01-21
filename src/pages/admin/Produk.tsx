import { useState, useEffect } from "react";
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
import { productService } from "../../services/adminService";
import type { Product as APIProduct } from "../../services/adminService";

interface Product {
    id: string;
    image: string;
    title: string;
    name: string;
    price: string;
    priceValue: number;
    date: string;
}

export default function AdminProduk() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [sortType, setSortType] = useState<string>("Default");

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();

            // Transform API data to match UI format
            const transformedProducts = data.map((product: APIProduct) => ({
                id: product.id || '',
                image: product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
                title: product.name,
                name: product.name,
                price: `Rp ${product.price.toLocaleString('id-ID')}`,
                priceValue: product.price,
                date: new Date().toISOString().split('T')[0] // Use current date if not provided
            }));

            setProducts(transformedProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            toast.error('Gagal memuat produk');
            // Fallback to empty array on error
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
        if (productToDelete !== null) {
            try {
                setDeleting(true);
                await productService.delete(productToDelete);

                // Update local state
                const updatedProducts = products.filter(p => p.id !== productToDelete);
                setProducts(updatedProducts);

                toast.success('Produk berhasil dihapus');
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            } catch (error) {
                console.error('Failed to delete product:', error);
                toast.error('Gagal menghapus produk');
            } finally {
                setDeleting(false);
            }
        }
    };

    const filteredProducts = products
        .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortType === "Harga Terendah") return a.priceValue - b.priceValue;
            if (sortType === "Harga Tertinggi") return b.priceValue - a.priceValue;
            if (sortType === "Terbaru") return new Date(b.date).getTime() - new Date(a.date).getTime();
            if (sortType === "Terlama") return new Date(a.date).getTime() - new Date(b.date).getTime();
            return 0;
        });

    const sortOptions = [
        "Default",
        "Harga Terendah",
        "Harga Tertinggi",
        "Terbaru",
        "Terlama"
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

                {/* Toolbar - Responsive */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                    {/* Filter & Search Row */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-1">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`px-4 md:px-6 py-2 border border-gray-200 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm text-sm md:text-base whitespace-nowrap ${sortType !== "Default" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <FilterOutlined /> <span className="hidden sm:inline">{sortType === "Default" ? "Filter" : sortType}</span>
                                <span className="sm:hidden">Filter</span>
                            </button>

                            {showFilter && (
                                <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 transition-all">
                                    {sortOptions.map(option => (
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

                    {/* Tambah Button */}
                    <button
                        onClick={() => navigate("/admin/produk/tambah")}
                        className="px-4 md:px-6 py-2 bg-[#2ecc71] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#27ae60] transition shadow-md active:scale-95 text-sm md:text-base whitespace-nowrap"
                    >
                        + Tambah
                    </button>
                </div>

                {/* Desktop Table View - Hidden on Mobile */}
                <div className="hidden lg:block border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 bg-[#c9d4fb] font-bold p-3 text-gray-800">
                        <div className="col-span-1 pl-4">No</div>
                        <div className="col-span-2">Gambar</div>
                        <div className="col-span-5">Judul Produk</div>
                        <div className="col-span-2">Harga</div>
                        <div className="col-span-1 text-center">Edit</div>
                        <div className="col-span-1 text-center">Hapus</div>
                    </div>

                    {/* Table Rows */}
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center p-3 border-t border-gray-100 hover:bg-gray-50 transition"
                            >
                                <div className="col-span-1 pl-4 font-bold">{index + 1}</div>
                                <div className="col-span-2">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100"
                                    />
                                </div>
                                <div className="col-span-5 font-bold">{item.title}</div>
                                <div className="col-span-2 font-bold">{item.price}</div>

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
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 font-medium">
                            Data produk "{search}" tidak ditemukan
                        </div>
                    )}

                    {/* Empty Rows for Aesthetic */}
                    {filteredProducts.length < 5 &&
                        Array.from({ length: 5 - filteredProducts.length }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 p-6 border-t border-gray-100 opacity-50">
                                <div className="col-span-12 h-4"></div>
                            </div>
                        ))
                    }
                </div>

                {/* Mobile Card View - Shown on Mobile/Tablet */}
                <div className="lg:hidden space-y-3">
                    {/* Table Header - Mobile */}
                    <div className="bg-[#c9d4fb] rounded-xl p-3 grid grid-cols-3 gap-2 font-bold text-gray-800 text-sm">
                        <div>Nama Produk</div>
                        <div className="text-center">Harga</div>
                        <div className="text-center">Edit/Hapus</div>
                    </div>

                    {/* Product Cards */}
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, index) => (
                            <div
                                key={item.id}
                                className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                            >
                                <div className="grid grid-cols-3 gap-3 items-center">
                                    {/* Product Info */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-500 flex-shrink-0">{index + 1}.</span>
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-10 h-10 rounded-lg object-cover shadow-sm border border-gray-100 flex-shrink-0"
                                        />
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-gray-800 truncate">{item.title}</p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center">
                                        <p className="font-bold text-sm text-gray-800">{item.price}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-center gap-2">
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
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 font-medium bg-white rounded-xl border border-gray-200">
                            Data produk "{search}" tidak ditemukan
                        </div>
                    )}
                </div>
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
