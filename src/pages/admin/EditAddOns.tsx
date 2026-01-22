import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { addOnService, productService } from "../../services/adminService";
import type { Product as APIProduct } from "../../services/adminService";

// TypeScript Interface - Sesuai Kontrak API Update Add-ons
interface UpdateAddOnPayload {
    name: string;
    price: number;
    link_add_ons: string;
}

export default function EditAddOns() {
    const navigate = useNavigate();
    const { productId, addOnId } = useParams();

    // Form State - Sesuai Kontrak API
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [linkAddOns, setLinkAddOns] = useState("");

    // UI State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productName, setProductName] = useState("");

    // Load existing add-on data from API
    useEffect(() => {
        if (!productId || !addOnId) {
            navigate("/admin/produk");
            return;
        }

        const fetchAddOn = async () => {
            try {
                setLoading(true);

                // Fetch product to get product name and add-ons
                const product: APIProduct = await productService.getById(productId);
                setProductName(product.name);

                // Find the specific add-on by index
                if (product.add_ons && product.add_ons.length > 0) {
                    const addOnIndex = parseInt(addOnId);
                    const addOn = product.add_ons[addOnIndex];

                    if (addOn) {
                        setName(addOn.name);
                        setPrice(addOn.price);
                        setLinkAddOns(addOn.link_add_ons || "");
                        setLoading(false);
                    } else {
                        toast.error('Add-on tidak ditemukan');
                        navigate(`/admin/produk/edit/${productId}`);
                    }
                } else {
                    toast.error('Produk tidak memiliki add-ons');
                    navigate(`/admin/produk/edit/${productId}`);
                }
            } catch (error) {
                console.error('Failed to fetch add-on:', error);
                toast.error('Gagal memuat data add-on');
                navigate("/admin/produk");
            }
        };

        fetchAddOn();
    }, [productId, addOnId, navigate]);

    // Submit Handler - Generate Payload Sesuai Kontrak API Update
    const handleSave = async () => {
        // Validation
        if (!name || price <= 0) {
            alert("Nama dan harga add-on wajib diisi");
            return;
        }

        if (!productId || !addOnId) return;

        // Construct payload IDENTIK dengan kontrak API Update
        const payload: UpdateAddOnPayload = {
            name,
            price,
            link_add_ons: linkAddOns
        };

        try {
            setSaving(true);
            await addOnService.update(addOnId, payload);
            toast.success('Add-on berhasil diperbarui');
            navigate(`/admin/produk/edit/${productId}`);
        } catch (error) {
            console.error('Failed to update add-on:', error);
            toast.error('Gagal memperbarui add-on');
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
        <div className="space-y-6 max-w-2xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Add-on</h1>
                <p className="text-sm text-gray-500">
                    Perbarui informasi add-on untuk produk: <span className="font-semibold text-gray-700">{productName}</span>
                </p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-400 p-8">
                <h2 className="text-xl font-bold text-gray-500 mb-6">Detail Add-on</h2>

                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Nama Add-on *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nama add-on"
                            className="w-full px-4 py-3 bg-[#f3f4f9] rounded-xl border-none focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>

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

                    {/* Link Add-ons */}
                    <div>
                        <label className="block text-gray-500 font-bold mb-2">Link Add-on</label>
                        <input
                            type="text"
                            value={linkAddOns}
                            onChange={(e) => setLinkAddOns(e.target.value)}
                            placeholder="https://www.example.com/product/add-ons/..."
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-xs text-gray-400 mt-2">URL link untuk add-on ini (opsional)</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center">
                <button
                    onClick={() => navigate(`/admin/produk/edit/${productId}`)}
                    className="px-10 py-3 bg-white border border-red-500 text-red-500 rounded-xl font-bold hover:bg-red-50 transition shadow-sm active:scale-95"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`px-10 py-3 rounded-xl font-bold transition shadow-lg active:scale-95 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {saving ? 'Menyimpan...' : 'Update'}
                </button>
            </div>
        </div>
    );
}
