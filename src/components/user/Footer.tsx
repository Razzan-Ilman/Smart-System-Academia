import { WhatsAppOutlined, MailOutlined } from '@ant-design/icons';
import logo from '../../images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800">
      {/* Footer content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-start gap-4">
          <img src={logo} alt="Smart System Academy" className="w-32 h-auto" />
          <p className="text-sm text-gray-500">
            Mewujudkan pendidikan digital yang cerdas dan mudah diakses.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 mb-2">Contact</h3>
          <div className="flex items-center gap-3">
            <WhatsAppOutlined className="text-green-500 text-xl" />
            <span>0896-8114-4333</span>
          </div>
          <div className="flex items-center gap-3">
            <MailOutlined className="text-blue-500 text-xl" />
            <span>yayasanpptik@gmail.com</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 mb-2">Company</h3>
          <ul className="flex flex-col gap-1 text-gray-600 text-sm">
            <li className="hover:text-gray-900 cursor-pointer transition">About Us</li>
            <li className="hover:text-gray-900 cursor-pointer transition">Careers</li>
            <li className="hover:text-gray-900 cursor-pointer transition">Press</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
          <ul className="flex flex-col gap-1 text-gray-600 text-sm">
            <li className="hover:text-gray-900 cursor-pointer transition">Blog</li>
            <li className="hover:text-gray-900 cursor-pointer transition">Events</li>
            <li className="hover:text-gray-900 cursor-pointer transition">Forums</li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        &copy; 2026 PT Langgeng Sejahtera Kreasi Komputas. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
