// components/user/detail/ProductHero.tsx
import { Star } from "lucide-react";
import type { Product } from "../../../services/productService";

interface ProductHeroProps {
  product: Product;
  images: string[];
  mainImage: string | null;
  onImageSelect: (image: string) => void;
}

const ProductHero: React.FC<ProductHeroProps> = ({
  product,
  images,
  mainImage,
  onImageSelect
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-[#7C3AED] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
          {product.category || "Populer"}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Image Gallery */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 items-start lg:-ml-8 lg:w-[calc(100%+2rem)]">
        {/* Thumbnails */}
        {images.length > 1 && (
          <ImageThumbnails
            images={images}
            selectedImage={mainImage}
            onSelect={onImageSelect}
          />
        )}

        {/* Main Image */}
        <MainImageDisplay
          image={mainImage}
          productName={product.name}
          category={product.category}
        />
      </div>
    </div>
  );
};

interface ImageThumbnailsProps {
  images: string[];
  selectedImage: string | null;
  onSelect: (image: string) => void;
}

const ImageThumbnails: React.FC<ImageThumbnailsProps> = ({
  images,
  selectedImage,
  onSelect
}) => {
  return (
    <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
      {images.map((img, i) => (
        <div
          key={i}
          onClick={() => onSelect(img)}
          className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ring-offset-2 shadow-sm hover:shadow-md
            ${
              selectedImage === img
                ? "ring-2 ring-[#7C3AED] opacity-100 scale-105"
                : "ring-1 ring-slate-200 opacity-70 hover:opacity-100 hover:ring-[#7C3AED]/50"
            }`}
        >
          <img
            src={img}
            alt={`Thumbnail ${i + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/no-image.png";
            }}
          />
        </div>
      ))}
    </div>
  );
};

interface MainImageDisplayProps {
  image: string | null;
  productName: string;
  category?: string;
}

const MainImageDisplay: React.FC<MainImageDisplayProps> = ({
  image,
  productName,
  category
}) => {
  return (
    <div className="flex-1 rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800 aspect-video relative group max-h-[600px] w-full">
      {/* Image */}
      <img
        src={image ?? "/no-image.png"}
        alt={productName}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
        onError={(e) => {
          e.currentTarget.src = "/no-image.png";
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>

      {/* Overlay Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        <p className="text-sm md:text-base font-medium text-slate-300 mb-1 tracking-wide uppercase">
          {category || "Digital Product"}
        </p>
        <h2 className="text-lg md:text-2xl font-bold leading-snug max-w-2xl">
          Mulai langkah profesionalmu dengan produk berkualitas tinggi ini.
        </h2>
      </div>
    </div>
  );
};

export default ProductHero;