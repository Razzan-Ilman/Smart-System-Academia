import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ShoppingOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import ConfirmModal from "../../components/admin/ConfirmModal";

// Import images
import Produk1 from "../../images/Produk1.jpg";
import Produk2 from "../../images/Produk2.jpg";

interface Product {
    id: number;
    image: string;
    title: string;
    price: string;
    priceValue: number;
    date: string;
}

const DEFAULT_PRODUCTS: Product[] = [
    { id: 1, image: Produk1, title: "Produk Unggulan A", price: "Rp 50.000", priceValue: 50000, date: "2024-01-10" },
    { id: 2, image: Produk2, title: "Produk Premium B", price: "Rp 75.000", priceValue: 75000, date: "2024-01-12" },
    { id: 3, image: Produk1, title: "Paket Belajar C", price: "Rp 120.000", priceValue: 120000, date: "2024-01-05" },
    { id: 4, image: Produk2, title: "Kursus Intensif D", price: "Rp 200.000", priceValue: 200000, date: "2024-01-15" },
    { id: 5, image: Produk1, title: "E-Book Eksklusif E", price: "Rp 35.000", priceValue: 35000, date: "2024-01-08" },
];

export default function AdminProduk() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("admin_products");
        if (saved) {
            setProducts(JSON.parse(saved));
        } else {
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem("admin_products", JSON.stringify(DEFAULT_PRODUCTS));
        }
    }, []);

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [sortType, setSortType] = useState<string>("Default");

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete !== null) {
            const updatedProducts = products.filter(p => p.id !== productToDelete);
            setProducts(updatedProducts);
            localStorage.setItem("admin_products", JSON.stringify(updatedProducts));
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
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

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                    <ShoppingOutlined className="text-2xl" />
                    <h1 className="text-2xl font-bold">Produk</h1>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`px-6 py-2 border border-gray-200 rounded-xl flex items-center gap-2 font-semibold transition shadow-sm ${sortType !== "Default" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                            >
                                <FilterOutlined /> {sortType === "Default" ? "Filter" : sortType}
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
                        onClick={() => navigate("/admin/produk/tambah")}
                        className="px-6 py-2 bg-[#2ecc71] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#27ae60] transition shadow-md active:scale-95"
                    >
                        + Tambah
                    </button>
                </div>

                {/* Table Container */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
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
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Produk?"
                confirmText="Ya, Hapus"
            />
        </div>
    );
}
