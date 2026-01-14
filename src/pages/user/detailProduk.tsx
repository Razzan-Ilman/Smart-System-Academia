import React, { useState } from "react";

type AddOn = {
  id: number;
  name: string;
  price: number;
};

const DetailProduk: React.FC = () => {
  const basePrice = 50000;

  const images = [
    "https://picsum.photos/900/500?random=1",
    "https://picsum.photos/900/500?random=2",
    "https://picsum.photos/900/500?random=3",
  ];

  const addOns: AddOn[] = [
    { id: 1, name: "Add-On Premium", price: 10000 },
    { id: 2, name: "Add-On Express", price: 15000 },
    { id: 3, name: "Add-On Support", price: 20000 },
    { id: 4, name: "Add-On Premium", price: 10000 },
    { id: 5, name: "Add-On Express", price: 15000 },
    { id: 6, name: "Add-On Support", price: 20000 },
    { id: 7, name: "Add-On Premium", price: 10000 },
];

  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);

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
    `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Produk Kami
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* MAIN IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
            <img
              src={mainImage}
              alt="Produk"
              className="w-full h-[350px] object-cover transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-gray-600">
            <p className="font-semibold mb-2">Deskripsi</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
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

          {/* ADD ONS */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-3">Add-Ons</h3>

  <div className="max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
  {addOns.map((addon) => {
    const isActive = selectedAddOns.includes(addon.id);

    return (
      <div
        key={addon.id}
        className={`flex items-center justify-between border rounded-lg p-3 mb-2 cursor-pointer transition
          ${isActive ? "bg-purple-50 border-purple-300" : "hover:bg-gray-50"}
        `}
        onClick={() => handleToggleAddOn(addon.id)}
      >
        {/* TEXT */}
        <div>
          <p className="font-medium">{addon.name}</p>
          <p className="text-sm text-gray-500">
            + {formatRupiah(addon.price)}
          </p>
        </div>

        {/* TOGGLE */}
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


            <p className="text-sm text-gray-600 mt-3">
              Add-Ons dipilih:{" "}
              <span className="font-semibold">
                {selectedAddOns.length}
              </span>
            </p>
          </div>

          {/* CHECKOUT */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Harga</span>
              <span className="text-[#7E89B9]">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <button className="w-full bg-[#7E89B9] hover:bg-[#6E79A9] text-white py-3 rounded-xl transition">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
