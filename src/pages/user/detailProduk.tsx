import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import { Plus, CheckCircle2, Star, Zap } from "lucide-react";
import { productService } from "../../services/productService";
import type { Product, AddOn } from "../../services/productService";

const DetailProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  /* ================= FETCH API ================= */
  useEffect(() => {
    if (!id) {
      setError("ID produk tidak valid");
      setLoading(false);
      return;
    }

    // Scroll to top when ID changes
    window.scrollTo(0, 0);

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getById(id);
        setProduct(data);
        setMainImage(data.images?.[0] ?? null);
        setError(null);

        // Fetch related products
        try {
          // Fetch 4 items to ensure we have 3 left after filtering out current product
          const result = await productService.getPaginated(1, 4, undefined, data.category_id);
          const related = (result.data || [])
            .filter((p: Product) => p.id !== data.id)
            .slice(0, 3);
          setRelatedProducts(related);
        } catch (err) {
          console.error("Failed to fetch related products:", err);
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Produk tidak ditemukan"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9]"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN (65-70%) */}
          <div className="lg:col-span-8 space-y-8">

            {/* HERO SECTION - Controlled Height */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#7C3AED] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {product.category || "Populer"}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.name}
                </h1>
              </div>


              <div className="flex flex-col-reverse lg:flex-row gap-4 items-start lg:-ml-8 lg:w-[calc(100%+2rem)]">

                {/* THUMBNAILS - VERTICAL ON DESKTOP */}
                {images.length > 1 && (
                  <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setMainImage(img)}
                        className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ring-offset-2 shadow-sm hover:shadow-md
                            ${mainImage === img
                            ? "ring-2 ring-[#7C3AED] opacity-100 scale-105"
                            : "ring-1 ring-slate-200 opacity-70 hover:opacity-100 hover:ring-[#7C3AED]/50"
                          }`}
                      >
                        <img
                          src={img}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex-1 rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800 aspect-video relative group max-h-[600px] w-full">
                  {/* Image */}
                  <img
                    src={mainImage ?? "/no-image.png"}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <p className="text-sm md:text-base font-medium text-slate-300 mb-1 tracking-wide uppercase">
                      {product.category || "Digital Product"}
                    </p>
                    <h2 className="text-lg md:text-2xl font-bold leading-snug max-w-2xl">
                      Mulai langkah profesionalmu dengan produk berkualitas tinggi ini.
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            {/* DESCRIPTION CARD */}
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
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (30-35%) - STICKY */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">

              {/* MAIN ACTION CARD */}
              <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>

                <div className="relative z-10">
                  <p className="text-sm text-slate-500 font-semibold mb-1 uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> Harga Terbaik
                  </p>
                  <h2 className="text-4xl font-black text-[#7C3AED] mb-6 tracking-tight">
                    {formatRupiah(totalPrice)}
                  </h2>

                  <button
                    className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] hover:bg-[#6D28D9] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mb-3"
                    onClick={() =>
                      navigate("/payment", {
                        state: {
                          productId: product.id,
                          productName: product.name,
                          basePrice,
                          totalPrice,
                          productImage: images[0],
                          productCategory: product.category,
                          selectedAddOnsIds: selectedAddOns,
                          addOns: getSelectedAddOnsData(),
                          productLink: product.link_product,
                        },
                      })
                    }
                  >
                    Beli Sekarang <Zap className="w-5 h-5" />
                  </button>

                  <p className="text-xs text-center text-slate-400 font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Akses langsung dikirim setelah pembayaran
                  </p>

                  {addOns.length > 0 && (
                    <div className="border-t border-slate-100 pt-6 mt-6">
                      <p className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm">
                        <Plus className="w-4 h-4 bg-purple-100 text-purple-600 rounded-full p-0.5" /> Tambah Add-Ons
                      </p>
                      <div className="space-y-3">
                        {addOns.map((addon) => {
                          if (!addon.id) return null;
                          const active = selectedAddOns.includes(addon.id);

                          return (
                            <div
                              key={addon.id}
                              onClick={() => handleToggleAddOn(addon.id!)}
                              className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center justify-between group
                                ${active
                                  ? "bg-purple-50 border-[#7C3AED] ring-1 ring-[#7C3AED]"
                                  : "border-slate-200 hover:border-purple-300 hover:bg-slate-50"
                                }
                                `}
                            >
                              <div>
                                <p className={`font-medium text-sm ${active ? "text-[#7C3AED]" : "text-slate-700 group-hover:text-[#7C3AED]"}`}>
                                  {addon.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                  + {formatRupiah(addon.price)}
                                </p>
                              </div>
                              {active ? (
                                <CheckCircle2 className="text-[#7C3AED] w-5 h-5 flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-purple-300" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* RELATED PRODUCTS - SIDEBAR LIST */}
              {relatedProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-purple-50 p-6">
                  <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Rekomendasi Lainnya</h3>
                  <div className="space-y-4">
                    {relatedProducts.map((relatedProduct) => (
                      <Link
                        key={relatedProduct.id}
                        to={`/produk/${relatedProduct.id}`}
                        className="cursor-pointer group flex gap-3 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-all duration-300"
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 relative shadow-sm group-hover:shadow-md transition-all">
                          <img
                            src={relatedProduct.images?.[0] ?? "/no-image.png"}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-[#7C3AED] transition-colors leading-snug">
                            {relatedProduct.name}
                          </h4>
                          <p className="text-[#7C3AED] font-bold text-xs mt-1 bg-purple-50 inline-block px-2 py-0.5 rounded-full self-start">
                            {formatRupiah(relatedProduct.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* MOBILE FLOATING CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Harga</p>
            <p className="text-lg font-black text-[#7C3AED]">{formatRupiah(totalPrice)}</p>
          </div>
          <button
            onClick={() => navigate("/payment", { state: { productId: product.id, productName: product.name, basePrice, totalPrice, productImage: images[0], productCategory: product.category, selectedAddOnsIds: selectedAddOns, addOns: getSelectedAddOnsData(), productLink: product.link_product } })}
            className="px-8 py-3 bg-[#7C3AED] text-white rounded-xl font-bold shadow-lg hover:bg-[#6D28D9] transition active:scale-95"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
