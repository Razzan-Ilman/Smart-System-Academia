import { useState, useEffect } from "react";
import {
    PictureOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

// Simple helper to format price
const formatPrice = (value: number) => {
    return value >= 1000 ? `${value / 1000}k` : `${value}`;
};

interface Product {
    id: number;
    image: string;
    title: string;
    price: string;
    priceValue: number;
    date: string;
    description?: string;
    platformLink?: string;
    category?: string;
    limit?: string | null;
}

export default function AdminEditProduk() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLimitQuantity, setIsLimitQuantity] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(""); // Input as string
    const [description, setDescription] = useState("");
    const [platformLink, setPlatformLink] = useState("");
    const [category, setCategory] = useState("");
    const [limit, setLimit] = useState("");
    const [originalImage, setOriginalImage] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("admin_products");
        if (saved && id) {
            const products = JSON.parse(saved);
            const product = products.find((p: Product) => p.id.toString() === id);

            if (product) {
                setTitle(product.title);
                setPrice(product.priceValue.toString());
                setDescription(product.description || "");
                setPlatformLink(product.platformLink || "");
                setCategory(product.category || "");
                setOriginalImage(product.image);

                if (product.limit) {
                    setIsLimitQuantity(true);
                    setLimit(product.limit);
                }
            } else {
                // If ID not found, maybe redirect
                navigate("/admin/produk");
            }
        }
    }, [id, navigate]);


    const handleSave = () => {
        if (!title || !price) {
            alert("Judul dan Harga wajib diisi");
            return;
        }

        const priceNum = parseInt(price);
        const saved = localStorage.getItem("admin_products");

        if (saved && id) {
            const products = JSON.parse(saved);
            const updatedProducts = products.map((p: Product) => {
                if (p.id.toString() === id) {
                    return {
                        ...p,
                        title: title,
                        price: formatPrice(priceNum),
                        priceValue: priceNum,
                        description,
                        platformLink,
                        category,
                        limit: isLimitQuantity ? limit : null,
                        image: originalImage // Keep original image
                    };
                }
                return p;
            });

            localStorage.setItem("admin_products", JSON.stringify(updatedProducts));
            navigate("/admin/produk");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
                <p className="text-sm text-gray-500">Perbarui informasi formulir berikut.</p>
            </div>

            {/* Main Detail Section */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-400 p-8 relative overflow-hidden">
                <h2 className="text-xl font-bold text-gray-500 mb-6">Detail</h2>

                <div className="flex gap-4 mb-8">
                    {/* Image Upload Placeholders */}
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer overflow-hidden">
                        {originalImage ? (
                            <img src={originalImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <PictureOutlined className="text-3xl" />
                        )}
                    </div>
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer">
                        <PlusOutlined className="text-2xl" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Judul Produk</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Judul Produk"
                            className="w-full px-4 py-3 bg-[#f3f4f9] rounded-xl border-none focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Deskripsi</label>
                        <div className="bg-[#f3f4f9] rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Simple Toolbar Mockup */}
                            <div className="bg-[#b1bdcd] p-3 flex items-center gap-4 text-gray-700">
                                <span className="font-bold">TT</span>
                                <span className="text-sm">16</span>
                                <span className="font-bold italic">B</span>
                                <span className="underline">U</span>
                                <span className="flex items-center gap-1">A <div className="w-3 h-3 bg-yellow-400 rounded-full" /></span>
                                <div className="w-px h-4 bg-gray-400 mx-1" />
                                <div className="flex gap-2">
                                    <div className="w-4 h-0.5 bg-gray-600 mb-0.5" />
                                    <div className="w-4 h-0.5 bg-gray-600 mb-0.5" />
                                </div>
                            </div>
                            <textarea
                                rows={8}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-transparent p-4 outline-none resize-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Platform</label>
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center gap-3">
                            <input
                                type="text"
                                value={platformLink}
                                onChange={(e) => setPlatformLink(e.target.value)}
                                placeholder="Link Gdrive"
                                className="flex-1 px-4 py-3 bg-white rounded-full border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Harga & Add-ons */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-6">
                {/* Harga section - takes 5 cols */}
                <div className="md:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-xl font-bold text-gray-500 mb-6">Harga</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-500 font-bold mb-2 text-sm">Harga Produk</label>
                            <div className="flex gap-2">
                                <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm font-bold text-gray-500">IDR</div>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0"
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-gray-500 font-bold text-sm">Limit Quantity</label>
                                <button
                                    onClick={() => setIsLimitQuantity(!isLimitQuantity)}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isLimitQuantity ? 'bg-blue-400' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isLimitQuantity ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>
                            <input
                                type="text"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                disabled={!isLimitQuantity}
                                placeholder="Masukan Quantity"
                                className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400 ${!isLimitQuantity ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Add-ons section - takes 6 cols */}
                <div className="md:col-span-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-500">Add-ons</h2>
                        <button className="text-[#2ecc71] font-bold flex items-center gap-1 hover:opacity-80 transition">
                            <PlusOutlined /> Tambah
                        </button>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl mb-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <DeleteOutlined className="text-gray-400 hover:text-red-500 cursor-pointer" />
                                <span className="font-bold text-gray-700">Judul Add-ons</span>
                            </div>
                            <EditOutlined className="text-gray-400 hover:text-blue-500 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Kategori Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-500 mb-6">Kategori</h2>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Masukan Kategori"
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                <button
                    onClick={() => navigate("/admin/produk")}
                    className="px-10 py-3 bg-white border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition shadow-sm active:scale-95"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-10 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition shadow-lg active:scale-95"
                >
                    Update
                </button>
            </div>
        </div>
    );
}
