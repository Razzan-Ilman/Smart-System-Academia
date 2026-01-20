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

  const instant = methods.filter(m => m.category === "instant");
  const va = methods.filter(m => m.category === "va");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-[500px] mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
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

        {/* Instant Payment Methods */}
        {instant.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-3">Instant Payment</p>
            <div className="space-y-2">
              {instant.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:shadow-md ${
                    selected === m.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={m.logo} 
                      alt={m.name}
                      className="h-6 object-contain" 
                    />
                    <span className="font-medium text-gray-800">{m.name}</span>
                  </div>
                  {selected === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Virtual Account Payment Methods */}
        {va.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-3">Virtual Account</p>
            <div className="space-y-2">
              {va.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className={`p-4 border-2 rounded-xl flex justify-between items-center cursor-pointer transition-all hover:shadow-md ${
                    selected === m.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={m.logo} 
                      alt={m.name}
                      className="h-6 object-contain" 
                    />
                    <span className="font-medium text-gray-800">{m.name}</span>
                  </div>
                  {selected === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
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
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            selected
              ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
};

export default PopupPayment;