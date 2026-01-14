import React from 'react';
import { HomeOutlined, AppstoreOutlined, ShoppingOutlined, ReadOutlined, TransactionOutlined, LogoutOutlined } from '@ant-design/icons';
import logo from '../../images/logo.png';

interface SidebarProps {
    activePath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
    const menuItems = [
        { name: 'Home', icon: <HomeOutlined />, path: 'Home' },
        { name: 'Kategori Produk', icon: <AppstoreOutlined />, path: 'Kategori Produk' },
        { name: 'Produk', icon: <ShoppingOutlined />, path: 'Produk' },
        { name: 'Course', icon: <ReadOutlined />, path: 'Course' },
        { name: 'List Transaksi', icon: <TransactionOutlined />, path: 'List Transaksi' },
        { name: 'Log Out', icon: <LogoutOutlined />, path: 'Log Out' },
    ];

    return (
        <div className="w-64 min-h-screen bg-[#1B3E59] text-white flex flex-col">
            {/* Logo Section */}
            <div className="p-8 flex items-center justify-center">
                <img src={logo} alt="Smart System Academy" className="w-32" />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors
              ${item.path === activePath
                                ? 'bg-[#007BFF] font-bold'
                                : 'hover:bg-[#254E6F]'}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-lg">{item.name}</span>
                    </div>
                ))}
            </nav>

            {/* Decorative Circles at Bottom Left */}
            <div className="relative h-32 overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue-400 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-purple-400 blur-lg"></div>
            </div>
        </div>
    );
};

export default Sidebar;
