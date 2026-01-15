import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Category {
    id: number;
    name: string;
}

export default function AdminEditKategori() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("admin_categories");
        if (saved && id) {
            const categories = JSON.parse(saved);
            const category = categories.find((c: Category) => c.id.toString() === id);
            if (category) {
                setName(category.name);
            }
        }
    }, [id]);

    const handleSave = () => {
        if (!name.trim()) return;

        const saved = localStorage.getItem("admin_categories");
        if (saved && id) {
            const categories = JSON.parse(saved);
            const updatedCategories = categories.map((c: Category) =>
                c.id.toString() === id ? { ...c, name: name } : c
            );
            localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
        }

        navigate("/admin/kategori-produk");
    };

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
