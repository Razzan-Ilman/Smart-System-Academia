import { useState } from "react";
import {
    MenuOutlined,
    EditOutlined,
    SearchOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

interface Transaction {
    id: number;
    name: string;
    method: string;
}

interface TransactionDetail {
    id: number;
    trxId: string;
    name: string;
    product: string;
    nominal: string;
    method: string;
    status: string;
    date: string;
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
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterMethod, setFilterMethod] = useState<string>("All");

    // Detail transaction data
    const transactionDetails: TransactionDetail[] = [
        { id: 1, trxId: "TRX001", name: "John Doe", product: "Kursus React", nominal: "Rp 500.000", method: "Transfer Bank", status: "Success", date: "2024-01-15" },
        { id: 2, trxId: "TRX002", name: "Jane Smith", product: "Buku Design System", nominal: "Rp 150.000", method: "E-Wallet", status: "Success", date: "2024-01-16" },
        { id: 3, trxId: "TRX003", name: "Bob Johnson", product: "Top-Up Saldo", nominal: "Rp 1.000.000", method: "Transfer Bank", status: "Pending", date: "2024-01-17" },
        { id: 4, trxId: "TRX004", name: "Alice Brown", product: "Sertifikat Web Dev", nominal: "Rp 300.000", method: "Midtrans", status: "Success", date: "2024-01-18" },
        { id: 5, trxId: "TRX005", name: "Charlie Wilson", product: "Paket Masterclass", nominal: "Rp 750.000", method: "E-Wallet", status: "Failed", date: "2024-01-19" },
    ];

    const filteredTransactions = transactionDetails.filter((detail) => {
        const matchSearch = detail.name.toLowerCase().includes(search.toLowerCase()) ||
            detail.product.toLowerCase().includes(search.toLowerCase()) ||
            detail.trxId.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "All" || detail.status === filterStatus;
        const matchMethod = filterMethod === "All" || detail.method === filterMethod;
        return matchSearch && matchStatus && matchMethod;
    });

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
                                <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl py-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Status Filter */}
                                    <div className="px-4 py-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Status</p>
                                        <div className="space-y-1">
                                            {["All", "Success", "Pending", "Failed"].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(status)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg transition text-sm font-medium ${filterStatus === status
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 my-2"></div>

                                    {/* Method Filter */}
                                    <div className="px-4 py-2">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Metode</p>
                                        <div className="space-y-1">
                                            {["All", "Transfer Bank", "E-Wallet", "Midtrans"].map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setFilterMethod(method)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-lg transition text-sm font-medium ${filterMethod === method
                                                            ? 'bg-blue-50 text-blue-700'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {method}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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
                        <div className="col-span-1 uppercase tracking-wider text-sm">TRX ID</div>
                        <div className="col-span-2 uppercase tracking-wider text-sm">NAMA</div>
                        <div className="col-span-2 uppercase tracking-wider text-sm">PRODUK</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">NOMINAL</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">METODE</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">STATUS</div>
                        <div className="col-span-2 text-center uppercase tracking-wider text-sm">TANGGAL</div>
                        <div className="col-span-1 text-center uppercase tracking-wider text-sm">AKSI</div>
                    </div>

                    {/* Table Rows */}
                    {filteredTransactions.length > 0 ? (
                        transactionDetails.map((detail, index) => (
                            <div
                                key={detail.id}
                                className="grid grid-cols-12 items-center p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                            >
                                <div className="col-span-1 pl-4 font-bold text-gray-800">{index + 1}</div>
                                <div className="col-span-1 font-mono text-sm text-blue-600">{detail.trxId}</div>
                                <div className="col-span-2 font-bold text-gray-800">{detail.name}</div>
                                <div className="col-span-2 text-gray-700">{detail.product}</div>
                                <div className="col-span-1 text-center font-semibold text-green-600">{detail.nominal}</div>
                                <div className="col-span-1 text-center text-gray-600">{detail.method}</div>
                                <div className="col-span-1 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${detail.status === 'Success' ? 'bg-green-100 text-green-700' :
                                        detail.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {detail.status}
                                    </span>
                                </div>
                                <div className="col-span-2 text-center text-gray-600">{detail.date}</div>
                                <div className="col-span-1 flex justify-center">
                                    <button className="p-2 text-gray-700 hover:text-blue-600 transition hover:scale-110 active:scale-90 bg-white rounded-lg shadow-sm border border-gray-50">
                                        <EditOutlined className="text-3xl" />
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
