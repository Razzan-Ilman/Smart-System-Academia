import { useState, useEffect, useRef } from "react";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import RichTextEditor from "../../components/RichTextEditor";
import { productService, addOnService, categoryService } from "../../services/adminService";
import type { Product as APIProduct } from "../../services/adminService";
import '../../styles/rich-text-editor.css';

// =========================
// TYPES
// =========================
interface AddOn {
    id?: string;
    name: string;
    price: number;
    link_add_ons: string;
}

interface UpdateProductPayload {
    name: string;
    description: string;
    link_product: string;
    price: number;
    stock: number;
    category_id: number;
}



export default function AdminEditProduk() {
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // =========================
    // FORM STATE
    // =========================
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [linkProduct, setLinkProduct] = useState("");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [stock, setStock] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [addOns, setAddOns] = useState<AddOn[]>([]);

    // =========================
    // UI STATE
    // =========================
    const [platformError, setPlatformError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [tempAddOn, setTempAddOn] = useState<AddOn>({
        name: "",
        price: 0,
        link_add_ons: ""
    });

    // =========================
    // FETCH PRODUCT
    // =========================
    useEffect(() => {
        if (!id) {
            navigate("/admin/produk");
            return;
        }

        const load = async () => {
            try {
                setLoading(true);

                // Load categories first (so select can show the correct option)
                try {
                    setLoadingCategories(true);
                    const cats = await categoryService.getAll();
                    setCategories(cats || []);
                } catch (err) {
                    console.warn('Failed to load categories', err);
                    setCategories([]);
                } finally {
                    setLoadingCategories(false);
                }

                const product: APIProduct = await productService.getById(id);

                if (!product) {
                    toast.error("Produk tidak ditemukan");
                    navigate("/admin/produk");
                    return;
                }

                setName(product.name);
                setPrice(Number(product.price ?? 0));
                setDescription(product.description ?? "");
                setLinkProduct(product.link_product ?? "");
                setCategoryId(product.category_id ?? 0);
                setStock(Number(product.stock ?? 0));
                // Normalize add-ons (ensure price is a number)
                const normalizedAddOns = (product.add_ons || []).map(a => ({
                    id: a.id,
                    name: a.name,
                    price: Number((a as any).price) || 0,
                    link_add_ons: a.link_add_ons || ""
                }));
                setAddOns(normalizedAddOns);
                setImages(product.images || []);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                toast.error("Gagal memuat data produk");
                navigate("/admin/produk");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, navigate]);

    // =========================
    // IMAGE UPLOAD
    // =========================
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            if (file.size > 5 * 1024 * 1024) return;

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // =========================
    // PLATFORM VALIDATION (uses categories from API)
    // =========================
    const getPlatformForCategory = (catId: number): string => {
        const category = categories.find(c => c.id === catId);
        if (!category) return "";

        const catName = category.name.toLowerCase();
        if (catName.includes("course") || catName.includes("kursus")) return "Google Drive";
        if (catName.includes("kelas") || catName.includes("class")) return "WhatsApp";
        return "";
    };

    const validatePlatformLink = (link: string, catId: number): boolean => {
        if (!link) return true;

        const platform = getPlatformForCategory(catId);
        if (!platform) return true;

        if (platform === "Google Drive") {
            if (!link.includes("drive.google.com") && !link.includes("docs.google.com") && !link.toLowerCase().includes("gdrive")) {
                setPlatformError("Link harus Google Drive untuk kategori Course");
                return false;
            }
        }

        if (platform === "WhatsApp") {
            if (!link.includes("whatsapp") && !link.includes("wa.me") && !link.includes("chat.whatsapp")) {
                setPlatformError("Link harus WhatsApp untuk kategori Kelas");
                return false;
            }
        }

        setPlatformError("");
        return true;
    };

    const handlePlatformLinkChange = (value: string) => {
        setLinkProduct(value);
        if (categoryId) validatePlatformLink(value, categoryId);
    };

    const handleCategoryChange = (value: string) => {
        const num = parseInt(value) || 0;
        setCategoryId(num);
        setPlatformError("");
        if (linkProduct && num) validatePlatformLink(linkProduct, num);
    };

    // Trigger hidden file input
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Add-on modal handlers (same behavior as TambahProduk but integrated with API in save handler)
    const openAddOnModal = () => {
        setTempAddOn({ name: "", price: 0, link_add_ons: "" });
        setEditingIndex(null);
        setIsAddOnModalOpen(true);
    };

    const openEditAddOnModal = (index: number) => {
        setTempAddOn({ ...addOns[index] } as AddOn);
        setEditingIndex(index);
        setIsAddOnModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddOnModalOpen(false);
        setTempAddOn({ name: "", price: 0, link_add_ons: "" });
        setEditingIndex(null);
    };

    const selectedPlatform = categoryId ? getPlatformForCategory(categoryId) : "";

    // =========================
    // ADD-ON HANDLER
    // =========================
    const handleSaveAddOn = async () => {
        if (!tempAddOn.name || tempAddOn.price <= 0) {
            toast.error("Nama dan harga wajib diisi");
            return;
        }

        if (!id) return;

        try {
            if (editingIndex !== null) {
                const existing = addOns[editingIndex];

                if (existing.id) {
                    await addOnService.update(existing.id, tempAddOn);
                }

                const updated = [...addOns];
                updated[editingIndex] = { ...tempAddOn, id: existing.id };
                setAddOns(updated);
            } else {
                await addOnService.create(id, tempAddOn);
                const product = await productService.getById(id);
                const normalized = (product.add_ons || []).map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    price: Number(a.price) || 0,
                    link_add_ons: a.link_add_ons || ""
                }));
                setAddOns(normalized);
            }

            setIsAddOnModalOpen(false);
            setEditingIndex(null);
            setTempAddOn({ name: "", price: 0, link_add_ons: "" });
            toast.success("Add-on berhasil disimpan");
        } catch {
            toast.error("Gagal menyimpan add-on");
        }
    };

    const handleDeleteAddOn = async (index: number) => {
        const addon = addOns[index];

        try {
            if (addon.id) await addOnService.delete(addon.id);
            setAddOns(prev => prev.filter((_, i) => i !== index));
            toast.success("Add-on dihapus");
        } catch {
            toast.error("Gagal menghapus add-on");
        }
    };

    // =========================
    // SAVE PRODUCT
    // =========================
    const handleSave = async () => {
        if (!name || price <= 0 || !categoryId || !linkProduct) {
            alert("Lengkapi data wajib");
            return;
        }

        if (!validatePlatformLink(linkProduct, categoryId)) return;
        if (!id) return;

        const payload: UpdateProductPayload = {
            name,
            description,
            link_product: linkProduct,
            price,
            stock,
            category_id: categoryId
        };

        try {
            setSaving(true);
            await productService.update(id, payload);
            toast.success("Produk berhasil diperbarui");
            navigate("/admin/produk");
        } catch {
            toast.error("Gagal memperbarui produk");
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1>
                <p className="text-sm text-gray-500">Perbarui informasi produk sesuai kontrak API backend.</p>
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
                        {loadingCategories ? (
                            <div className="w-full px-4 py-4 bg-white border-2 border-blue-400 rounded-xl shadow-sm text-gray-500 text-center">
                                Memuat kategori...
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="w-full px-4 py-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-600 text-center">
                                Tidak ada kategori tersedia.
                            </div>
                        ) : (
                            <select
                                value={categoryId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-4 bg-white border-2 border-blue-400 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            >
                                <option value={0}>Pilih Kategori</option>
                                {categories.map(cat => {
                                    const platform = getPlatformForCategory(cat.id);
                                    return (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}{platform ? ` (${platform})` : ''}
                                        </option>
                                    );
                                })}
                            </select>
                        )}
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
                                    selectedPlatform
                                        ? `Link ${selectedPlatform}`
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
                    className={`px-10 py-3 rounded-xl font-bold transition shadow-lg active:scale-95 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {saving ? 'Menyimpan...' : 'Update'}
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
                                <label className="block text-gray-700 font-semibold mb-2">Link Add-on</label>
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
