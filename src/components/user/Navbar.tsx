import React, { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import logo from "../../images/logo.png";

const Navbar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const menuItems = [
    { key: '1', label: 'Riwayat Pembelian' },
    { key: '2', label: 'Produk' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-9 py-2 bg-white/30 backdrop-blur-md border-b border-white/20">
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="w-[96px] h-auto object-contain drop-shadow-xl"
        />

        {/* Desktop Menu + Sign In */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-gray-800 font-semibold">
            {menuItems.map(item => (
              <li key={item.key} className="hover:text-blue-600 cursor-pointer transition text-2xl">
                {item.label}
              </li>
            ))}
          </ul>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Hamburger + Sign In */}
        <div className="flex md:hidden items-center gap-4">
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1"
          >
            Sign In
          </Button>
          <Button
            type="text"
            icon={<MenuOutlined className="text-2xl text-gray-800" />}
            onClick={showDrawer}
          />
        </div>
      </nav>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Menu"
        placement="right" // <-- dari kanan sekarang
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <ul className="flex flex-col p-4 gap-4 text-gray-800 font-semibold">
          {menuItems.map(item => (
            <li
              key={item.key}
              className="hover:text-blue-600 cursor-pointer text-lg"
              onClick={closeDrawer}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </Drawer>
    </>
  );
};

export default Navbar;
