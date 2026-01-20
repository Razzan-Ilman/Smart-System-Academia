import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import { X, Plus, Menu, CheckCircle2 } from "lucide-react";

type AddOn = {
  id: number;
  name: string;
  price: number;
};

const DetailProduk = () => {
  const navigate = useNavigate();
  const basePrice = 50000;

  const images = [
    "https://picsum.photos/900/500?random=1",
    "https://picsum.photos/900/500?random=2",
    "https://picsum.photos/900/500?random=3",
  ];

  const addOns: AddOn[] = [
    { id: 1, name: "Judul Add-ons", price: 10000 },
    { id: 2, name: "Judul Add-ons", price: 15000 },
    { id: 3, name: "Judul Add-ons", price: 20000 },
    { id: 4, name: "Judul Add-ons", price: 10000 },
    { id: 5, name: "Judul Add-ons", price: 15000 },
    { id: 6, name: "Judul Add-ons", price: 15000 },
    { id: 7, name: "Judul Add-ons", price: 15000 },
    { id: 8, name: "Judul Add-ons", price: 15000 },
    { id: 9, name: "Judul Add-ons", price: 15000 },
  ];

  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [showAddOnsPopup, setShowAddOnsPopup] = useState(false);

  const handleToggleAddOn = (id: number) => {
    setSelectedAddOns((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const totalAddOnPrice = addOns
    .filter((a) => selectedAddOns.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const totalPrice = basePrice + totalAddOnPrice;

  const formatRupiah = (value: number) =>
    `IDR ${value.toLocaleString("id-ID")}`;

  // Add-Ons Component (reusable for both mobile and desktop)
  const AddOnsSection = ({ onClose }: { onClose?: () => void }) => (
    <div className="h-full flex flex-col">
      {/* Header - Only for mobile popup */}
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b bg-purple-50">
          <h3 className="font-semibold text-lg">Judul Add-ons</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Title for desktop */}
      {!onClose && (
        <h3 className="font-semibold mb-3">Add-Ons</h3>
      )}

      {/* Add-ons List */}
      <div className={`flex-1 overflow-y-auto ${onClose ? 'p-4' : 'pr-2'} ${!onClose && 'max-h-[260px]'} scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100`}>
        {addOns.map((addon) => {
          const isActive = selectedAddOns.includes(addon.id);

          return (
            <div
              key={addon.id}
              className={`flex items-center justify-between border rounded-lg p-4 mb-3 cursor-pointer transition
                ${isActive ? "bg-purple-50 border-purple-300" : "hover:bg-gray-50 border-gray-200"}
              `}
              onClick={() => handleToggleAddOn(addon.id)}
            >
              <div>
                <p className="font-medium text-gray-800">{addon.name}</p>
              </div>

              {/* Toggle Switch */}
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition
                  ${isActive ? "bg-purple-500" : "bg-gray-300"}
                `}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition
                    ${isActive ? "translate-x-6" : "translate-x-0"}
                  `}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected count - Desktop only */}
      {!onClose && (
        <p className="text-sm text-gray-600 mt-3">
          Add-Ons dipilih:{" "}
          <span className="font-semibold">{selectedAddOns.length}</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Mobile Header */}
      <Navbar />

      <div className="p-4 md:p-6">
        {/* Desktop Title */}
        <h1 className="hidden md:block text-2xl font-semibold text-center mb-6">
          Detail Produk Kami
        </h1>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT - Product Details */}
          <div className="md:col-span-2 space-y-4 md:space-y-6">
            {/* MAIN IMAGE */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
              <img
                src={mainImage}
                alt="Produk"
                className="w-full h-[250px] md:h-[350px] object-cover transition"
              />
            </div>

            {/* Mobile: Product Info Card */}
            <div className="md:hidden bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-1">Judul Produk</h2>
              
              {/* Thumbnail Images - Mobile */}
              <div className="flex gap-2 mb-4">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setMainImage(img)}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover border cursor-pointer
                      ${
                        mainImage === img
                          ? "ring-2 ring-purple-500"
                          : "hover:ring-2 hover:ring-purple-300"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 text-gray-600">
              <p className="font-semibold mb-2">Deskripsi</p>
              <p className="text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
            </div>

            {/* Mobile: Add-On Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowAddOnsPopup(true)}
                className="w-full bg-white rounded-xl shadow-lg p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-medium">Add-On (Optional)</span>
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile: Price & Checkout */}
            <div className="md:hidden space-y-3">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Total</div>
                <div className="text-xl font-bold text-purple-600">
                  {formatRupiah(totalPrice)}
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg transition"
                onClick={() => {
                  navigate("/payment", {
                    state: {
                      totalPrice,
                      basePrice,
                      addOns: addOns.filter(a => selectedAddOns.includes(a.id)),
                    },
                  });
                }}
              >
                Check Out
              </button>
            </div>
          </div>

          {/* RIGHT - Desktop Only */}
          <div className="hidden md:block space-y-6">
            {/* PRODUCT INFO */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-1">Nama Produk</h2>
              <p className="text-lg font-bold mb-4">
                {formatRupiah(basePrice)}
              </p>

              <p className="text-sm text-gray-600 mb-2">Gambar</p>
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 rounded-lg object-cover border cursor-pointer
                      ${
                        mainImage === img
                          ? "ring-2 ring-purple-500"
                          : "hover:ring-2 hover:ring-purple-300"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* ADD ONS - Desktop */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <AddOnsSection />
            </div>

            {/* CHECKOUT - Desktop */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Harga</span>
                <span className="text-purple-600">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
                onClick={() => {
                  navigate("/payment", {
                    state: {
                      totalPrice,
                      basePrice,
                      addOns: addOns.filter(a => selectedAddOns.includes(a.id)),
                    },
                  });
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

{/* ===== MOBILE ADD-ONS POPUP ===== */}
{showAddOnsPopup && (
  <div
    className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-end"
    onClick={() => setShowAddOnsPopup(false)}
  >
    <div
      className="w-full bg-white rounded-t-3xl max-h-[75vh] flex flex-col animate-slide-up"
      onClick={(e) => e.stopPropagation()}
    >

      {/* ===== HEADER ===== */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Pilih Add Ons</h3>
          <p className="text-sm text-gray-500">
            Tambahan opsional untuk produk kamu
          </p>
        </div>

        <button
          onClick={() => setShowAddOnsPopup(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ✕
        </button>
      </div>

      {/* ===== INI BAGIAN YANG BISA DI SCROLL ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-2
        scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">

        {/* Contoh list Add Ons */}
        {addOns.map((item) => (
          <div
            key={item.id}
            onClick={() => handleToggleAddOn(item.id)}
            className={`
              mb-3 p-3 border rounded-xl cursor-pointer transition
              flex items-center justify-between
              ${selectedAddOns.includes(item.id)
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200"}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {formatRupiah(item.price)}
                </p>
              </div>
            </div>

            <div>
              {selectedAddOns.includes(item.id) ? (
                <CheckCircle2 className="text-purple-600" />
              ) : (
                <div className="w-5 h-5 border rounded-full" />
              )}
            </div>
          </div>
        ))}

      </div>

      {/* ===== FOOTER FIX ===== */}
      <div className="p-4 border-t bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Add-On (Optional)
          </span>
          <Plus className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-xl font-bold text-purple-600">
            {formatRupiah(totalPrice)}
          </span>
        </div>

        <button
          onClick={() => {
          navigate("/payment", {
            state: {
              totalPrice,
              basePrice,
              addOns: addOns.filter(a => selectedAddOns.includes(a.id)),
            },
          });
        }}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-xl font-semibold active:scale-95 transition"
        >
          Check Out
        </button>
      </div>

    </div>
  </div>
)}

{/* ===== STYLE ANIMATION + SCROLL ===== */}
<style>{`
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }

  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }

  .scrollbar-thumb-purple-400::-webkit-scrollbar-thumb {
    background-color: #c084fc;
    border-radius: 3px;
  }

  .scrollbar-track-purple-100::-webkit-scrollbar-track {
    background-color: #f3e8ff;
  }
`}</style>
    </div>
  );
};

export default DetailProduk;