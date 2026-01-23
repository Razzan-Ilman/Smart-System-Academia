import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import { X, Plus, CheckCircle2 } from "lucide-react";
import { productService } from "../../services/productService";
import type { Product, AddOn } from "../../services/productService";

const DetailProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showAddOnsPopup, setShowAddOnsPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH API ================= */
  useEffect(() => {
    if (!id) {
      setError("ID produk tidak valid");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
        setMainImage(data.images?.[0] ?? null);
        setError(null);
      } catch (err) {
        console.error("Fetch detail error:", err);
        setError("Gagal memuat detail produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= HELPERS ================= */
  const addOns = product?.add_ons ?? [];
  const images = product?.images ?? [];
  const basePrice = product?.price ?? 0;

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const getSelectedAddOnsData = (): AddOn[] => {
    return addOns.filter((addon) => addon.id && selectedAddOns.includes(addon.id));
  };

  const totalAddOnPrice = getSelectedAddOnsData().reduce(
    (sum, a) => sum + a.price,
    0
  );

  const totalPrice = basePrice + totalAddOnPrice;

  const formatRupiah = (value: number) =>
    `IDR ${value.toLocaleString("id-ID")}`;

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Produk tidak ditemukan"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />

      <div className="p-4 md:p-6">
        <h1 className="hidden md:block text-2xl font-semibold text-center mb-6">
          Detail Produk
        </h1>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">
            {/* MAIN IMAGE */}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
              <img
                src={mainImage ?? "/no-image.png"}
                alt={product.name}
                className="w-full h-[250px] md:h-[350px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/no-image.png";
                }}
              />
            </div>

            {/* MOBILE INFO */}
            <div className="md:hidden bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-3">{product.name}</h2>

              <div className="flex gap-2 mb-4 overflow-x-auto">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setMainImage(img)}
                    className={`w-12 h-12 flex-shrink-0 rounded-lg object-cover cursor-pointer transition
                      ${mainImage === img
                        ? "ring-2 ring-purple-500"
                        : "hover:ring-2 hover:ring-purple-300"
                      }`}
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
              <p className="font-semibold mb-2">Deskripsi</p>
              <div 
                className="text-sm md:text-base text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* MOBILE ADD-ONS BUTTON */}
            {addOns.length > 0 && (
              <div className="md:hidden">
                <button
                  onClick={() => setShowAddOnsPopup(true)}
                  className="w-full bg-white rounded-xl shadow-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <span className="font-medium">
                    Add-On (Optional) {selectedAddOns.length > 0 && `(${selectedAddOns.length})`}
                  </span>
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* MOBILE CHECKOUT */}
            <div className="md:hidden space-y-3">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-xl font-bold text-purple-600">
                  {formatRupiah(totalPrice)}
                </div>
              </div>

              <button
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition active:scale-95"
                onClick={() =>
                  navigate("/payment", {
                    state: {
                      productId: product.id,
                      productName: product.name,
                      basePrice,
                      totalPrice,
                      productImage: images[0],
                      productCategory: `Kategori ${product.category_id}`,
                      selectedAddOnsIds: selectedAddOns,
                      addOns: getSelectedAddOnsData(),
                    },
                  })
                }
              >
                Check Out
              </button>
            </div>
          </div>

          {/* RIGHT DESKTOP */}
          <div className="hidden md:block space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-2xl font-bold text-purple-600 mb-4">
                {formatRupiah(basePrice)}
              </p>

              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 rounded-lg object-cover cursor-pointer transition
                      ${mainImage === img
                        ? "ring-2 ring-purple-500"
                        : "hover:ring-2 hover:ring-purple-400"
                      }`}
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
                ))}
              </div>
            </div>

            {addOns.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-3">Add-Ons (Optional)</h3>

                <div className="space-y-3">
                  {addOns.map((addon) => {
                    if (!addon.id) return null;
                    const active = selectedAddOns.includes(addon.id);

                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddOn(addon.id!)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all
                          ${active
                            ? "bg-purple-50 border-purple-400"
                            : "border-gray-200 hover:border-purple-200 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{addon.name}</p>
                            <p className="text-sm text-gray-500">
                              {formatRupiah(addon.price)}
                            </p>
                          </div>
                          {active && (
                            <CheckCircle2 className="text-purple-600 w-5 h-5 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span className="text-purple-600">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition active:scale-95"
                onClick={() =>
                  navigate("/payment", {
                    state: {
                      productId: product.id,
                      productName: product.name,
                      basePrice,
                      totalPrice,
                      productImage: images[0],
                      productCategory: `Kategori ${product.category_id}`,
                      selectedAddOnsIds: selectedAddOns,
                      addOns: getSelectedAddOnsData(),
                    },
                  })
                }
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ADD-ON POPUP */}
      {showAddOnsPopup && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:hidden"
          onClick={() => setShowAddOnsPopup(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl max-h-[75vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg">Pilih Add Ons</h3>
              <button 
                onClick={() => setShowAddOnsPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(75vh-60px)]">
              {addOns.map((addon) => {
                if (!addon.id) return null;
                const active = selectedAddOns.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddOn(addon.id!)}
                    className={`p-4 border rounded-xl mb-3 flex justify-between items-center cursor-pointer transition
                      ${active
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatRupiah(addon.price)}
                      </p>
                    </div>

                    {active && (
                      <CheckCircle2 className="text-purple-600 w-5 h-5 flex-shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProduk;