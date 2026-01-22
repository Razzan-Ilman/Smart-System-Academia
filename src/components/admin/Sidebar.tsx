import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import ConfirmModal from "./ConfirmModal";
import { authService } from "../../services/adminService";

export default function SidebarHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogout = () => {
    authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate("/admin/login");
  };

  const menuItems = [
    { label: "Home", icon: <HomeOutlined />, path: "/admin/dashboard" },
    { label: "Kategori Produk", icon: <AppstoreOutlined />, path: "/admin/kategori-produk" },
    { label: "Produk", icon: <ShoppingOutlined />, path: "/admin/produk" },
    { label: "List Transaksi", icon: <UnorderedListOutlined />, path: "/admin/list-transaksi" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#0f3c56] text-white rounded-lg shadow-lg hover:bg-[#1a5270] transition-colors"
      >
        {isMobileMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[#0f3c56] text-white flex flex-col p-4 
          lg:rounded-tr-3xl lg:rounded-br-3xl 
          shadow-[0_0_25px_rgba(59,130,246,0.35)]
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 mt-16 lg:mt-0">
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
              onClick={closeMobileMenu}
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
      </aside>

      {/* Modal at root level - not inside sidebar */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
