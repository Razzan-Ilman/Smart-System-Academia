import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarHome from './admin/Sidebar'; // Import Sidebar
import Navbar from './admin/Navbar'; // Import Navbar

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#dbe4f3] to-[#f4dce7]">
      {/* Sidebar di kiri */}
      <SidebarHome />

      {/* Konten utama di kanan */}
      <div className="flex-1 flex flex-col overflow-hidden pt-8">
        <div className="px-6">
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto px-6 pb-6 mt-2">
          <Outlet /> {/* Konten halaman (Chart, Table, dll.) */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;