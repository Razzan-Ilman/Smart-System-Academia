import { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer, Button } from 'antd';
import logo from "../../images/logo.png";

const Navbar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const menuItems = [
    { key: '1', label: 'Produk' },
    { key: '2', label: 'About' },
    { key: '3', label: 'Contact' },
  ];

  return (
<>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-5 md:px-9 py-1.5 sm:py-2 bg-white/30 backdrop-blur-md border-b border-white/20">
        {/* Logo */}
        <img
          src={logo}
          alt="logo"
          className="w-16 sm:w-20 md:w-[96px] h-auto object-contain drop-shadow-xl"
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-8 text-gray-800 font-semibold">
            {menuItems.map(item => (
              <li
                key={item.key}
                className="hover:text-blue-600 cursor-pointer transition text-2xl"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl sm:text-2xl text-gray-800" />}
            onClick={showDrawer}
          />
        </div>
      </nav>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Menu"
        placement="right"
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

