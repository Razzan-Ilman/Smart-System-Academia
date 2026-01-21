import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { categoryService } from "../../services/adminService";

export default function AdminTambahKategori() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            alert("Nama kategori wajib diisi");
            return;
        }

        try {
            setSaving(true);
            await categoryService.create({ name: name.trim() });
            toast.success('Kategori berhasil ditambahkan');
            navigate("/admin/kategori-produk");
        } catch (error) {
            console.error('Failed to create category:', error);
            toast.error('Gagal menambahkan kategori');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            {/* Header */}
            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800">Tambah Kategori Produk</h1>
                <p className="text-sm text-gray-500">Isi formulir berikut untuk menambahkan kategori baru.</p>
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
                    SIMPAN
                </button>
            </div>
        </div>
    );
}
