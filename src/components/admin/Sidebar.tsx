import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import ConfirmModal from "./ConfirmModal";

export default function SidebarHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    navigate("/admin/login");
  };

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, path: "/admin/dashboard" },
    { label: "Kategori Produk", icon: <AppstoreOutlined />, path: "/admin/kategori-produk" },
    { label: "Produk", icon: <ShoppingOutlined />, path: "/admin/produk" },
    { label: "List Transaksi", icon: <UnorderedListOutlined />, path: "/admin/list-transaksi" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-[#0f3c56] text-white flex flex-col p-4 rounded-tr-3xl rounded-br-3xl shadow-[0_0_25px_rgba(59,130,246,0.35)]">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <span className="font-bold text-sm leading-tight px-2">
          Smart System
          <br />
          Academia
        </span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive(item.path)
              ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.9)] ring-2 ring-blue-300"
              : "hover:bg-white/20"
              }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/20 transition text-red-300 mt-6 w-full text-left"
        >
          <LogoutOutlined />
          Log Out
        </button>
      </nav>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </aside>
  );
}
