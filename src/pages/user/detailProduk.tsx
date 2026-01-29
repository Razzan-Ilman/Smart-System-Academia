// pages/user/DetailProduk.tsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/user/Navbar";
import ProductHero from "../../components/user/detail/ProductHero";
import ProductDescription from "../../components/user/detail/ProductDescription";
import ProductSidebar from "../../components/user/detail/ProductSidebar";
import MobileFloatingCTA from "../../components/user/detail/MobileFloatingCTA";
import LoadingState from "../../components/user/detail/LoadingState";
import ErrorState from "../../components/user/detail/ErrorState";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useAddOnSelection } from "../../hooks/useAddOnSelection";

const DetailProduk = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    product,
    mainImage,
    setMainImage,
    loading,
    error,
    relatedProducts
  } = useProductDetail(id);

  const {
    selectedAddOns,
    toggleAddOn,
    getSelectedAddOnsData,
    totalAddOnPrice
  } = useAddOnSelection(product?.add_ons ?? []);

  // Scroll to top when ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Computed values
  const images = product?.images ?? [];
  const basePrice = product?.price ?? 0;
  const totalPrice = basePrice + totalAddOnPrice;

  const handleBuyNow = () => {
    if (!product) return;

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
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return <ErrorState error={error} onBack={() => navigate("/")} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN (65-70%) */}
          <div className="lg:col-span-8 space-y-8">
            <ProductHero
              product={product}
              images={images}
              mainImage={mainImage}
              onImageSelect={setMainImage}
            />

            <ProductDescription description={product.description} />
          </div>

          {/* RIGHT SIDEBAR (30-35%) - STICKY */}
          <div className="lg:col-span-4 relative">
            <ProductSidebar
              totalPrice={totalPrice}
              addOns={product.add_ons ?? []}
              selectedAddOns={selectedAddOns}
              relatedProducts={relatedProducts}
              onToggleAddOn={toggleAddOn}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING CTA */}
      <MobileFloatingCTA
        totalPrice={totalPrice}
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default DetailProduk;