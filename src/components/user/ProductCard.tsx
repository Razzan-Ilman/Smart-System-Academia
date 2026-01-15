import { ShoppingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  category: string;
  price: string;
  image?: string; // optional (dummy / backend nanti)
}

const ProductCard = ({ title, category, price, image }: Props) => {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      
      {/* IMAGE / ICON */}
      <div className="w-full h-40 bg-purple-100 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        ) : (
          <ShoppingOutlined className="text-5xl text-purple-500" />
        )}
      </div>

      {/* CONTENT */}
    <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{category}</p>
        <p className="font-semibold text-gray-800 mt-1">{price}</p>

        <Link to="/produk/detail">
          <button
            className="mt-4 w-full py-2 text-white rounded-lg transition"
            style={{ backgroundColor: "#7E89B9" }}
          >
            Lihat Detail
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
