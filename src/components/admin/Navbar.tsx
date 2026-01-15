import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined } from "@ant-design/icons";

export default function Navbar() {
  const [showIncome, setShowIncome] = useState(true);

  // simulasi data login
  const user = {
    name: "Abare no Ken",
  };

  const income = 12500000;

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div className="w-full grid grid-cols-2 gap-6 mb-6">
      {/* Profil */}
      <div className="relative bg-gradient-to-r from-[#aab6e8] to-[#d8dcf5] rounded-2xl p-4 shadow-lg flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center overflow-hidden">
          {/* Kalau nanti ada foto user, tinggal ganti img */}
          <UserOutlined className="text-2xl text-blue-500" />
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg px-4 py-2 shadow font-semibold text-gray-700">
            Nama: {user.name}
          </div>
        </div>
      </div>

      {/* Pendapatan */}
      <div className="bg-gradient-to-r from-[#e6cfe4] to-[#f4e7f2] rounded-2xl p-4 shadow-lg flex items-center justify-between">
        <div className="bg-white rounded-full px-4 py-2 font-semibold">
          IDR
        </div>

        <div className="flex-1 mx-4 bg-white rounded-lg h-10 flex items-center px-4 font-semibold text-gray-700">
          {showIncome ? formatRupiah(income) : "••••••••••"}
        </div>

        <button
          onClick={() => setShowIncome(!showIncome)}
          className="w-9 h-9 rounded-full border flex items-center justify-center bg-white hover:bg-gray-100 transition"
        >
          {showIncome ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </button>
      </div>
    </div>
  );
}
