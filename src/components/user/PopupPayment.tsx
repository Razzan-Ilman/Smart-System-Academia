import React from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";

type PaymentMethod = {
  id: string;
  name: string;
  icon?: any;
  description?: string;
  // optional additional fields that some callers may provide
  category?: string;
  logo?: any;
};

type Props = {
  open: boolean;
  onClose: () => void;
  methods?: PaymentMethod[];
  selected?: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
};

const PopupPayment: React.FC<Props> = ({
  open,
  onClose,
  methods = [],   // ← jaga-jaga kalau undefined
  selected,
  onSelect,
  onConfirm,
}) => {
  if (!open) return null;

  // 👉 DATA DEFAULT BIAR PASTI MUNCUL
  const fallbackMethods: PaymentMethod[] = [
    {
      id: "qris",
      name: "QRIS",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/QRIS_logo.svg",
    },
    {
      id: "gopay",
      name: "GoPay",
      category: "instant",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/GoPay_logo.svg",
    },
    {
      id: "bca",
      name: "BCA Virtual Account",
      category: "va",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
    },
  ];

  // kalau parent kosong → pakai fallback
  const source = methods.length > 0 ? methods : fallbackMethods;

  const instant = source.filter(m => m.category === "instant");
  const va = source.filter(m => m.category === "va");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-100 w-full max-w-lg">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Pilih Metode Pembayaran
            </h3>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* ========== INSTANT PAYMENT ========== */}
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Instant Payment
        </p>

        <div className="space-y-3 mb-6">
          {instant.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selected === method.id
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* LOGO GAMBAR */}
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 border">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="max-h-8 object-contain"
                  />
                </div>

                <p className="font-semibold text-gray-800">
                  {method.name}
                </p>
              </div>

              {selected === method.id && (
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
              )}
            </button>
          ))}
        </div>

        {/* ========== VIRTUAL ACCOUNT ========== */}
        <p className="text-sm font-semibold text-gray-500 mb-2">
          Virtual Account
        </p>

        <div className="space-y-3">
          {va.map((method) => (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                selected === method.id
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-1 border">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="max-h-8 object-contain"
                  />
                </div>

                <p className="font-semibold text-gray-800">
                  {method.name}
                </p>
              </div>

              {selected === method.id && (
                <CheckCircle2 className="w-6 h-6 text-purple-500" />
              )}
            </button>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-6">
          <button
            disabled={!selected}
            onClick={onConfirm}
            className={`
              w-full py-3 rounded-xl text-white font-semibold transition
              ${
                selected
                  ? "bg-[#7E89B9] hover:bg-[#6E79A9]"
                  : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            Konfirmasi
          </button>
        </div>

      </div>
    </div>
  );
};

export default PopupPayment;
