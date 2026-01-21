import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { categoryService } from "../../services/adminService";
import type { Category as APICategory } from "../../services/adminService";

interface Category {
    id: number;
    name: string;
}

export default function AdminEditKategori() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) {
            navigate("/admin/kategori-produk");
            return;
        }

        const fetchCategory = async () => {
            try {
                setLoading(true);
                const category: APICategory = await categoryService.getById(parseInt(id));
                setName(category.name);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch category:', error);
                toast.error('Gagal memuat data kategori');
                navigate("/admin/kategori-produk");
            }
        };

        fetchCategory();
    }, [id, navigate]);

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Nama kategori wajib diisi");
            return;
        }

        if (!id) return;

        try {
            setSaving(true);
            await categoryService.update(parseInt(id), { name: name.trim() });
            toast.success('Kategori berhasil diperbarui');
            navigate("/admin/kategori-produk");
        } catch (error) {
            console.error('Failed to update category:', error);
            toast.error('Gagal memperbarui kategori');
        } finally {
            setSaving(false);
        }
    };

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
        <div className="space-y-6 max-w-xl mx-auto">
            {/* Header */}
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800">Edit Kategori Produk</h1>
                <p className="text-sm text-gray-500">Ubah formulir berikut untuk memperbarui kategori.</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center">
                <div className="w-full mb-10">
                    <label className="block text-2xl font-bold text-gray-800 mb-4">Nama Kategori</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukan nama kategori"
                        className="w-full px-5 py-4 bg-[#f3f4f9] rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg text-gray-700"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-[#9df382] hover:bg-[#8ae26f] text-white font-bold text-2xl rounded-full shadow-lg transition-all active:scale-95 uppercase tracking-wider"
                >
                    SIMPAN PERUBAHAN
                </button>
            </div>
        </div>
    );
}
