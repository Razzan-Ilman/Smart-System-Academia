import { useState } from "react";
import {
    MenuOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

interface Transaction {
    id: number;
    name: string;
    method: string;
}

export default function AdminListTransaksi() {
    const [transactions] = useState<Transaction[]>([
        { id: 1, name: "Transaksi Pembelian Kursus React", method: "Transfer Bank" },
        { id: 2, name: "Transaksi Pembelian Buku Design System", method: "E-Wallet" },
        { id: 3, name: "Transaksi Top-Up Saldo Pelatihan", method: "Transfer Bank" },
        { id: 4, name: "Transaksi Sertifikat Web Dev", method: "Midtrans" },
        { id: 5, name: "Transaksi Paket Masterclass Node.js", method: "E-Wallet" },
    ]);

    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Title */}
            <div className="flex items-center gap-3">
                <UnorderedListOutlined className="text-2xl text-gray-700" />
                <h1 className="text-2xl font-bold text-gray-800">List Transaksi</h1>
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl flex items-center gap-2 font-semibold text-gray-700 hover:bg-gray-50 transition shadow-sm"
                            >
                                <MenuOutlined /> Filter
                            </button>

                            {showFilter && (
                                <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700">Terbaru</button>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700">Terlama</button>
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Hinted search text"
                                className="pl-6 pr-12 py-2.5 bg-[#f3f0f7] rounded-full w-96 focus:outline-none focus:ring-1 focus:ring-purple-200 transition-all shadow-inner text-gray-600"
                            />
                            <SearchOutlined className="absolute right-5 top-3.5 text-gray-400 group-hover:text-purple-500 cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 bg-white font-bold p-5 text-gray-800 border-b border-gray-100">
                        <div className="col-span-1 pl-4 uppercase tracking-wider text-sm">NO</div>
                        <div className="col-span-5 uppercase tracking-wider text-sm">Transaksi</div>
                        <div className="col-span-2 uppercase tracking-wider text-sm">Methode</div>
                        <div className="col-span-2 text-center uppercase tracking-wider text-sm">Edit</div>
                        <div className="col-span-2 text-center uppercase tracking-wider text-sm">Hapus</div>
                    </div>

                    {/* Table Rows */}
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-12 items-center p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                            >
                                <div className="col-span-1 pl-4 font-bold text-gray-800">{index + 1}</div>
                                <div className="col-span-5 font-bold text-gray-800 text-lg">
                                    {item.name}
                                </div>
                                <div className="col-span-2 font-bold text-gray-600">
                                    {item.method}
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <button className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110 active:scale-90 bg-white rounded-lg shadow-sm border border-gray-50">
                                        <EditOutlined className="text-3xl" />
                                    </button>
                                </div>

                                <div className="col-span-2 flex justify-center">
                                    <button className="p-2 text-gray-700 hover:text-red-500 transition hover:scale-110 active:scale-90 bg-white rounded-lg shadow-sm border border-gray-50">
                                        <DeleteOutlined className="text-3xl" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-16 text-center text-gray-400 font-medium">
                            Data transaksi "{search}" tidak ditemukan
                        </div>
                    )}

                    {/* Empty Rows for Aesthetic */}
                    {filteredTransactions.length < 5 &&
                        Array.from({ length: 5 - filteredTransactions.length }).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 p-10 border-b border-gray-50 opacity-30 last:border-0">
                                <div className="col-span-12 h-4"></div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
