import React from 'react';
import NavbarAdmin from '../../components/admin/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <NavbarAdmin />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-6">
            <ul>
              <li className="px-6 py-3 hover:bg-gray-200 cursor-pointer">
                <span className="text-gray-700">Dashboard</span>
              </li>
              <li className="px-6 py-3 hover:bg-gray-200 cursor-pointer">
                <span className="text-gray-700">Users</span>
              </li>
              <li className="px-6 py-3 hover:bg-gray-200 cursor-pointer">
                <span className="text-gray-700">Settings</span>
              </li>
              <li className="px-6 py-3 hover:bg-gray-200 cursor-pointer">
                <span className="text-gray-700">Reports</span>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow p-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">$12,345</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">567</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Feedback</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">89</p>
            </div>
          </div>

          {/* Additional Content */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">User John Doe logged in</li>
              <li className="text-gray-600">New order placed by Jane Smith</li>
              <li className="text-gray-600">System backup completed</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
