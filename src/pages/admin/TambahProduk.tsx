import { useState, useRef } from "react";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "../../components/RichTextEditor";
import { productService } from "../../services/adminService";
import '../../styles/rich-text-editor.css';

// TypeScript Interface - Sesuai Kontrak API
interface AddOn {
    name: string;
    price: number;
    link_add_ons: string;
}

interface ProductPayload {
    name: string;
    description: string;
    price: number;
    link_product: string;
    images: string[];
    category_id: number;
    stock: number;
    add_ons: AddOn[];
}

// Category mapping
const CATEGORIES = [
    { id: 1, name: "Course", platform: "Google Drive" },
    { id: 2, name: "Kelas", platform: "WhatsApp" }
];

export default function AdminTambahProduk() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State - Sesuai Kontrak API
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [linkProduct, setLinkProduct] = useState("");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [stock, setStock] = useState<number>(0);
    const [addOns, setAddOns] = useState<AddOn[]>([]);

    // UI State
    const [platformError, setPlatformError] = useState("");
    const [saving, setSaving] = useState(false);
    const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempAddOn, setTempAddOn] = useState<AddOn>({ name: "", price: 0, link_add_ons: "" });

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                alert('Hanya file gambar yang diperbolehkan');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImages(prev => [...prev, base64String]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Validate platform link
    const validatePlatformLink = (link: string, catId: number): boolean => {
        if (!link) return true;

        const category = CATEGORIES.find(c => c.id === catId);
        if (!category) return true;

        if (category.name === "Course") {
            const isValidGdrive = link.includes("drive.google.com") ||
                link.includes("docs.google.com") ||
                link.toLowerCase().includes("gdrive");
            if (!isValidGdrive) {
                setPlatformError("Link harus berupa Google Drive untuk kategori Course");
                return false;
            }
        } else if (category.name === "Kelas") {
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

    const handlePlatformLinkChange = (value: string) => {
        setLinkProduct(value);
        if (categoryId) {
            validatePlatformLink(value, categoryId);
        }
    };

    // Add-on Modal Handlers
    const openAddOnModal = () => {
        setTempAddOn({ name: "", price: 0, link_add_ons: "" });
        setEditingIndex(null);
        setIsAddOnModalOpen(true);
    };

    const openEditAddOnModal = (index: number) => {
        setTempAddOn({ ...addOns[index] });
        setEditingIndex(index);
        setIsAddOnModalOpen(true);
    };

    const handleSaveAddOn = () => {
        if (!tempAddOn.name || tempAddOn.price <= 0) {
            alert("Nama dan harga add-on wajib diisi");
            return;
        }

        if (editingIndex !== null) {
            // Update existing
            const updated = [...addOns];
            updated[editingIndex] = tempAddOn;
            setAddOns(updated);
        } else {
            // Add new
            setAddOns([...addOns, tempAddOn]);
        }

        setIsAddOnModalOpen(false);
        setTempAddOn({ name: "", price: 0, link_add_ons: "" });
        setEditingIndex(null);
    };

    const handleDeleteAddOn = (index: number) => {
        setAddOns(addOns.filter((_, i) => i !== index));
    };

    const handleCloseModal = () => {
        setIsAddOnModalOpen(false);
        setTempAddOn({ name: "", price: 0, link_add_ons: "" });
        setEditingIndex(null);
    };

    // Submit Handler - Generate Payload Sesuai Kontrak API
    const handleSave = async () => {
        // Validation
        if (!name || price <= 0 || !categoryId) {
            alert("Nama, harga, dan kategori wajib diisi");
            return;
        }

        if (!linkProduct) {
            alert("Link produk wajib diisi");
            return;
        }

        if (!validatePlatformLink(linkProduct, categoryId)) {
            return;
        }

        // Construct payload IDENTIK dengan kontrak API
        const payload: ProductPayload = {
            name,
            description,
            price,
            link_product: linkProduct,
            images,
            category_id: categoryId,
            stock,
            add_ons: addOns
        };

        try {
            setSaving(true);
            console.log('Creating product with payload:', payload);
            const response = await productService.create(payload);
            console.log('Product created successfully:', response);
            toast.success('Produk berhasil ditambahkan');
            navigate("/admin/produk");
        } catch (error: any) {
            console.error('Failed to create product:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);

            // Show specific error message if available
            const errorMessage = error.response?.data?.message || error.message || 'Gagal menambahkan produk';
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Tambah Produk</h1>
                <p className="text-sm text-gray-500">Isi formulir sesuai kontrak API backend.</p>
            </div>

            {/* Main Detail Section */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-400 p-8">
                <h2 className="text-xl font-bold text-gray-500 mb-6">Detail Produk</h2>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                />

                {/* Images Upload */}
                <div className="mb-6">
                    <label className="block text-gray-500 font-bold mb-3">Gambar Produk</label>
                    <div className="flex gap-4 flex-wrap">
                        {images.map((image, index) => (
                            <div key={index} className="relative w-24 h-24 group">
                                <img
                                    src={image}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover rounded-2xl border-2 border-blue-400"
                                />
                                <button
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                >
                                    <CloseCircleOutlined className="text-sm" />
                                </button>
                            </div>
                        ))}

                        <div
                            onClick={triggerFileInput}
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer"
                        >
                            <PlusOutlined className="text-2xl" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Upload gambar produk (max 5MB per file)</p>
                </div>

                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Nama Produk *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama Produk"
                            className="w-full px-4 py-3 bg-[#f3f4f9] rounded-xl border-none focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Deskripsi</label>
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Tulis deskripsi produk di sini..."
                        />
                    </div>

                    {/* Category ID */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Kategori *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(parseInt(e.target.value))}
                            className="w-full px-4 py-4 bg-white border-2 border-blue-400 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                        >
                            <option value={0}>Pilih Kategori</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Link Product */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Link Produk *</label>
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col gap-2">
                            <input
                                type="text"
                                value={linkProduct}
                                onChange={(e) => handlePlatformLinkChange(e.target.value)}
                                disabled={!categoryId}
                                placeholder={
                                    selectedCategory
                                        ? `Link ${selectedCategory.platform}`
                                        : "Pilih kategori terlebih dahulu"
                                }
                                className={`flex-1 px-4 py-3 bg-white rounded-full border shadow-sm outline-none focus:ring-2 ${!categoryId
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

                    {/* Price & Stock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Price */}
                        <div>
                            <label className="block text-gray-500 font-bold mb-2">Harga *</label>
                            <div className="flex gap-2">
                                <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm font-bold text-gray-500">IDR</div>
                                <input
                                    type="number"
                                    value={price || ""}
                                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-gray-500 font-bold mb-2">Stok *</label>
                            <input
                                type="number"
                                value={stock || ""}
                                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add-ons Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-500">Add-ons</h2>
                    <button
                        type="button"
                        onClick={openAddOnModal}
                        className="text-[#2ecc71] font-bold flex items-center gap-1 hover:opacity-80 transition"
                    >
                        <PlusOutlined /> Tambah
                    </button>
                </div>

                <div className="space-y-3">
                    {addOns.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Belum ada add-ons</p>
                    ) : (
                        addOns.map((addon, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAddOn(index)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                    >
                                        <DeleteOutlined />
                                    </button>
                                    <div className="flex-1">
                                        <span className="font-bold text-gray-700 block">{addon.name}</span>
                                        <span className="text-sm text-gray-500">Rp {addon.price.toLocaleString('id-ID')}</span>
                                        {addon.link_add_ons && (
                                            <span className="text-xs text-blue-500 block truncate max-w-xs">{addon.link_add_ons}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openEditAddOnModal(index)}
                                    className="text-gray-400 hover:text-blue-500 transition"
                                >
                                    <EditOutlined />
                                </button>
                            </div>
                        ))
                    )}
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
                    disabled={saving}
                    className={`px-10 py-3 rounded-xl font-bold transition shadow-lg active:scale-95 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                >
                    {saving ? 'Menyimpan...' : 'Tambah'}
                </button>
            </div>

            {/* Add-On Modal */}
            {isAddOnModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingIndex !== null ? "Edit Add-on" : "Tambah Add-on"}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Nama *</label>
                                <input
                                    type="text"
                                    value={tempAddOn.name}
                                    onChange={(e) => setTempAddOn({ ...tempAddOn, name: e.target.value })}
                                    placeholder="Nama add-on"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Harga *</label>
                                <input
                                    type="number"
                                    value={tempAddOn.price || ""}
                                    onChange={(e) => setTempAddOn({ ...tempAddOn, price: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Link Add-ons</label>
                                <input
                                    type="text"
                                    value={tempAddOn.link_add_ons}
                                    onChange={(e) => setTempAddOn({ ...tempAddOn, link_add_ons: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveAddOn}
                                className="flex-1 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
