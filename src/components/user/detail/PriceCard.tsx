// components/user/detail/PriceCard.tsx
import { Star, Zap, CheckCircle2, Plus } from "lucide-react";
import AddOnItem from "./AddOnItem";
import { formatRupiah } from "../../../utils/currency";
import type { AddOn } from "../../../services/productService";

interface PriceCardProps {
  totalPrice: number;
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggleAddOn: (id: string) => void;
  onBuyNow: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({
  totalPrice,
  addOns,
  selectedAddOns,
  onToggleAddOn,
  onBuyNow
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

      <div className="relative z-10">
        {/* Price Section */}
        <p className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Harga
          Terbaik
        </p>
        <h2 className="text-4xl font-black text-[#7C3AED] mb-6 tracking-tight">
          {formatRupiah(totalPrice)}
        </h2>

        {/* Buy Button */}
        <button
          className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:bg-[#6D28D9] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
          onClick={onBuyNow}
        >
          Beli Sekarang <Zap className="w-5 h-5" />
        </button>

        <p className="text-xs text-center text-slate-400 font-medium flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Akses langsung dikirim setelah
          pembayaran
        </p>

        {/* Add-ons Section */}
        {addOns.length > 0 && (
          <div className="border-t border-slate-100 pt-6 mt-6">
            <p className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full p-0.5" />{" "}
              Tambah Add-Ons
            </p>
            <div className="space-y-3">
              {addOns.map((addon) => {
                if (!addon.id) return null;
                return (
                  <AddOnItem
                    key={addon.id}
                    addon={addon}
                    isSelected={selectedAddOns.includes(addon.id)}
                    onToggle={() => onToggleAddOn(addon.id!)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceCard;