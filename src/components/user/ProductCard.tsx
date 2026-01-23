import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Props {
  id: string;   // ✅ string
  title: string;
  category: string;
  price: string;
  image?: string;
}

const ProductCard = ({ id, title, category, price, image }: Props) => {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to product:", id);
    navigate(`/produk/${id}`);
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      <div className="w-full h-40 bg-purple-100 flex items-center justify-center overflow-hidden">
        {!image || imgError ? (
          <ShoppingOutlined className="text-5xl text-purple-500" />
        ) : (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{category}</p>
        <p className="font-semibold text-gray-800 mt-1">{price}</p>
        
        <button
          type="button"
          onClick={handleClick}
          className="mt-4 w-full py-2 text-white rounded-lg transition hover:opacity-90 active:scale-95"
          style={{ backgroundColor: '#7E89B9' }}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

export default ProductCard;