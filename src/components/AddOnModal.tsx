import { useState, useEffect } from 'react';

interface AddOnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, price: string) => void;
    editData?: { id: number; title: string; price: string } | null;
}

export default function AddOnModal({ isOpen, onClose, onSave, editData }: AddOnModalProps) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    // Set initial values when editing
    useEffect(() => {
        if (editData) {
            setTitle(editData.title);
            setPrice(editData.price);
        } else {
            setTitle('');
            setPrice('');
        }
    }, [editData, isOpen]);

    const handleSave = () => {
        if (!title || !price) {
            alert('Judul dan Harga wajib diisi');
            return;
        }
        onSave(title, price);
        setTitle('');
        setPrice('');
        onClose();
    };

    const handleCancel = () => {
        setTitle('');
        setPrice('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {editData ? 'Edit Add-Ons' : 'Tambah Add-Ons'}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Judul Add-Ons</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Masukkan judul add-ons"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Harga</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Masukkan harga"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 bg-blue-300 text-white rounded-lg font-semibold hover:bg-blue-400 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
