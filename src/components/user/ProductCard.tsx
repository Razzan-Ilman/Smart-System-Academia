import { ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductImage } from '../../services/productService';

interface Props {
  id: string;
  title: string;
  category: string; // nama kategori
  price: number | string;
  image?: string;
}

const ProductCard = ({ id, title, category, price, image }: Props) => {
  const [imgUrl, setImgUrl] = useState<string | null>(image || null);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  // Fetch image jika belum ada
  useEffect(() => {
    if (!image) {
      getProductImage(id).then(setImgUrl).catch(() => setImgError(true));
    }
  }, [id, image]);

  const handleClick = () => navigate(`/produk/${id}`);

  // Pastikan harga dalam format IDR
  const formattedPrice =
    typeof price === 'number'
      ? `IDR ${price.toLocaleString('id-ID')}`
      : price;

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
      {/* Image / Icon */}
      <div className="w-full h-40 bg-purple-100 flex items-center justify-center overflow-hidden">
        {!imgUrl || imgError ? (
          <ShoppingOutlined className="text-5xl text-purple-500" />
        ) : (
          <img
            src={imgUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">{category}</p>
        <p className="font-semibold text-gray-800 mt-1">{formattedPrice}</p>

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
