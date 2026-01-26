import React from "react";
import { CreditCard, CheckCircle2, X } from "lucide-react";

type PaymentMethodType = {
  id: string;
  name: string;
  category: string;
  logo: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  methods: PaymentMethodType[];
  selected?: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
};

const PopupPayment: React.FC<Props> = ({
  open,
  onClose,
  methods = [],
  selected,
  onSelect,
  onConfirm,
}) => {
  if (!open) return null;

  // Filter berdasarkan kategori
  const instantPayment = methods.filter(m => m.category === "Instant Payment");
  const virtualAccount = methods.filter(m => m.category === "Virtual Account");
  const otherPayment = methods.filter(m => m.category === "Other");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header - Sticky with Blur */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Pilih Pembayaran
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6">

          {/* Instant Payment Methods */}
          {instantPayment.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Instant Payment</p>
              <div className="grid grid-cols-2 gap-3">
                {instantPayment.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`p-5 border-2 rounded-xl flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-md min-h-[140px] relative ${selected === m.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                      }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center py-2">
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="h-20 w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-logo')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-logo w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg';
                            fallback.textContent = m.name.substring(0, 3).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="w-full pt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-800 text-xs text-center block leading-tight">{m.name}</span>
                    </div>
                    {selected === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Virtual Account Payment Methods */}
          {virtualAccount.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Virtual Account</p>
              <div className="grid grid-cols-2 gap-3">
                {virtualAccount.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`p-5 border-2 rounded-xl flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-md min-h-[140px] relative ${selected === m.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                      }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center py-2">
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="h-20 w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-logo')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-logo w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg';
                            fallback.textContent = m.name.substring(0, 3).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="w-full pt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-800 text-xs text-center block leading-tight">{m.name}</span>
                    </div>
                    {selected === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Payment Methods */}
          {otherPayment.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Other</p>
              <div className="grid grid-cols-2 gap-3">
                {otherPayment.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`p-5 border-2 rounded-xl flex flex-col items-center justify-between cursor-pointer transition-all hover:shadow-md min-h-[140px] relative ${selected === m.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                      }`}
                  >
                    <div className="w-full flex-1 flex items-center justify-center py-2">
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="h-20 w-full object-contain"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.fallback-logo')) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-logo w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg';
                            fallback.textContent = m.name.substring(0, 3).toUpperCase();
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="w-full pt-3 border-t border-gray-100">
                      <span className="font-semibold text-gray-800 text-xs text-center block leading-tight">{m.name}</span>
                    </div>
                    {selected === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={!selected}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${selected
              ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupPayment;