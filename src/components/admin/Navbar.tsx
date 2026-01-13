import React from 'react';
import logo from "../../images/logo.png";

const NavbarAdmin = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-white shadow">
      {/* Logo */}
      <div className="text-xl font-bold tracking-wide">
        <img src={logo} alt="logo" />
      </div>

      {/* Menu */}
      <ul className="flex gap-8 text-gray-700 font-medium">
        <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
        <li className="hover:text-blue-600 cursor-pointer">Users</li>
        <li className="hover:text-blue-600 cursor-pointer">Settings</li>
        <li className="hover:text-blue-600 cursor-pointer">Logout</li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin;