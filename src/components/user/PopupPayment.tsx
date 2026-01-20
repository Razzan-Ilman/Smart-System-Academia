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

  // Filter berdasarkan kategori yang BENAR
  const instantPayment = methods.filter(m => m.category === "Instant Payment");
  const bankTransfer = methods.filter(m => m.category === "Bank Transfer");
  const virtualAccount = methods.filter(m => m.category === "Virtual Account");

  console.log("Instant Payment:", instantPayment);
  console.log("Bank Transfer:", bankTransfer);
  console.log("Virtual Account:", virtualAccount);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
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
        {instantPayment.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-3">Instant Payment</p>
            <div className="grid grid-cols-2 gap-3">
              {instantPayment.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md min-h-[100px] relative ${
                    selected === m.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img 
                    src={m.logo} 
                    alt={m.name}
                    className="h-8 object-contain" 
                  />
                  <span className="font-medium text-gray-800 text-sm text-center">{m.name}</span>
                  {selected === m.id && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 absolute top-2 right-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bank Transfer Payment Methods */}
        {bankTransfer.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-3">Bank Transfer</p>
            <div className="grid grid-cols-2 gap-3">
              {bankTransfer.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelect(m.id)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md min-h-[100px] relative ${
                    selected === m.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img 
                    src={m.logo} 
                    alt={m.name}
                    className="h-8 object-contain" 
                  />
                  <span className="font-medium text-gray-800 text-sm text-center">{m.name}</span>
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
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:shadow-md min-h-[100px] relative ${
                    selected === m.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <img 
                    src={m.logo} 
                    alt={m.name}
                    className="h-8 object-contain" 
                  />
                  <span className="font-medium text-gray-800 text-sm text-center">{m.name}</span>
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