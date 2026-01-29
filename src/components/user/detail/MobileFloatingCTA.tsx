// components/user/detail/MobileFloatingCTA.tsx
import { formatRupiah } from "../../../utils/currency";

interface MobileFloatingCTAProps {
  totalPrice: number;
  onBuyNow: () => void;
}

const MobileFloatingCTA: React.FC<MobileFloatingCTAProps> = ({
  totalPrice,
  onBuyNow
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50">
      <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            Total Harga
          </p>
          <p className="text-lg font-black text-[#7C3AED]">
            {formatRupiah(totalPrice)}
          </p>
        </div>
        <button
          onClick={onBuyNow}
          className="px-8 py-3 bg-[#7C3AED] text-white rounded-xl font-bold shadow-lg hover:bg-[#6D28D9] transition active:scale-95"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
};

export default MobileFloatingCTA;