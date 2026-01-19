import { useState, useEffect, useRef } from "react";
import {
    PictureOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../../components/RichTextEditor";
import AddOnModal from "../../components/AddOnModal";
import '../../styles/rich-text-editor.css';

// Simple helper to format price
const formatPrice = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(""); // Input as string
    const [description, setDescription] = useState("");
    const [platformLink, setPlatformLink] = useState("");
    const [category, setCategory] = useState("");
    const [limit, setLimit] = useState("");
    const [images, setImages] = useState<string[]>([]); // Store base64 images
    const [originalImage, setOriginalImage] = useState("");
    const [platformError, setPlatformError] = useState("");

    // Add-ons State
    const [addOns, setAddOns] = useState<Array<{ id: number, title: string, price: string }>>([]);
    const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
    const [editingAddOn, setEditingAddOn] = useState<{ id: number, title: string, price: string } | null>(null);

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

                // Load existing images
                if (product.images && Array.isArray(product.images)) {
                    setImages(product.images);
                } else if (product.image) {
                    // If only single image exists, add it to images array
                    setImages([product.image]);
                }

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

    // Validate platform link based on category
    const validatePlatformLink = (link: string, cat: string): boolean => {
        if (!link) return true; // Empty is allowed, will be checked on save

        if (cat === "Course") {
            // Check if link contains Google Drive patterns
            const isValidGdrive = link.includes("drive.google.com") ||
                link.includes("docs.google.com") ||
                link.toLowerCase().includes("gdrive");
            if (!isValidGdrive) {
                setPlatformError("Link harus berupa Google Drive untuk kategori Course");
                return false;
            }
        } else if (cat === "Kelas") {
            // Check if link contains WhatsApp patterns
            const isValidWA = link.includes("wa.me") ||
                link.includes("whatsapp.com") ||
                link.includes("chat.whatsapp");
            if (!isValidWA) {
                setPlatformError("Link harus berupa WhatsApp untuk kategori Kelas");
                return false;
            }
        }

        setPlatformError("");
        return true;
    };

    // Handle platform link change with validation
    const handlePlatformLinkChange = (value: string) => {
        setPlatformLink(value);
        if (category) {
            validatePlatformLink(value, category);
        }
    };


    // Handle Add-on functions
    const handleAddOnSave = (title: string, price: string) => {
        if (editingAddOn) {
            setAddOns(addOns.map(addon =>
                addon.id === editingAddOn.id
                    ? { ...addon, title, price }
                    : addon
            ));
            setEditingAddOn(null);
        } else {
            const newAddOn = { id: Date.now(), title, price };
            setAddOns([...addOns, newAddOn]);
        }
    };

    const handleEditAddOn = (addon: { id: number, title: string, price: string }) => {
        setEditingAddOn(addon);
        setIsAddOnModalOpen(true);
    };

    const handleDeleteAddOn = (id: number) => {
        setAddOns(addOns.filter(addon => addon.id !== id));
    };

    const handleCloseModal = () => {
        setIsAddOnModalOpen(false);
        setEditingAddOn(null);
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImages((prev) => [...prev, base64]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDeleteImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

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

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />

                <div className="flex gap-4 mb-8 flex-wrap">
                    {/* Display uploaded images */}
                    {images.map((img, index) => (
                        <div key={index} className="relative w-24 h-24 border-2 border-gray-300 rounded-2xl overflow-hidden group">
                            <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                                <CloseCircleOutlined />
                            </button>
                        </div>
                    ))}

                    {/* Upload button */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer"
                    >
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
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Tulis deskripsi produk di sini..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Kategori</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-4 bg-white border-2 border-blue-400 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Course">Course</option>
                            <option value="Kelas">Kelas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Platform</label>
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col gap-2">
                            <input
                                type="text"
                                value={platformLink}
                                onChange={(e) => handlePlatformLinkChange(e.target.value)}
                                disabled={!category}
                                placeholder={
                                    category === "Course"
                                        ? "Link Gdrive"
                                        : category === "Kelas"
                                            ? "Link WhatsApp"
                                            : "Pilih kategori terlebih dahulu"
                                }
                                className={`flex-1 px-4 py-3 bg-white rounded-full border shadow-sm outline-none focus:ring-2 ${!category
                                    ? 'border-gray-200 cursor-not-allowed bg-gray-100'
                                    : platformError
                                        ? 'border-red-400 focus:ring-red-400'
                                        : 'border-gray-200 focus:ring-blue-400'
                                    }`}
                            />
                            {platformError && (
                                <p className="text-red-500 text-sm font-semibold px-2">
                                    ⚠️ {platformError}
                                </p>
                            )}
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
                        <button
                            type="button"
                            onClick={() => setIsAddOnModalOpen(true)}
                            className="text-[#2ecc71] font-bold flex items-center gap-1 hover:opacity-80 transition"
                        >
                            <PlusOutlined /> Tambah
                        </button>
                    </div>

                    <div className="flex-1 space-y-3">
                        {addOns.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">Belum ada add-ons</p>
                        ) : (
                            addOns.map((addon) => (
                                <div key={addon.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddOn(addon.id)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                        <div>
                                            <span className="font-bold text-gray-700 block">{addon.title}</span>
                                            <span className="text-sm text-gray-500">Rp {parseInt(addon.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEditAddOn(addon)}
                                        className="text-gray-400 hover:text-blue-500 transition"
                                    >
                                        <EditOutlined />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
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

            {/* Add-On Modal */}
            <AddOnModal
                isOpen={isAddOnModalOpen}
                onClose={handleCloseModal}
                onSave={handleAddOnSave}
                editData={editingAddOn}
            />
        </div>
    );
}
