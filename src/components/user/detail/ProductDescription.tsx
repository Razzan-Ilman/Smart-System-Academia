// components/user/detail/ProductDescription.tsx
import { Star } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-50 overflow-hidden relative">
      {/* Decorative Header Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>

      <div className="p-8 relative z-10">
        <div className="flex items-center gap-3 mb-6 border-b border-purple-100 pb-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Star className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Deskripsi Lengkap
          </h3>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <div
            className="text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;