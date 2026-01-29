// components/user/detail/ProductSidebar.tsx
import PriceCard from "./PriceCard";
import RelatedProducts from "./RelatedProducts";
import type { AddOn, Product } from "../../../services/productService";

interface ProductSidebarProps {
  totalPrice: number;
  addOns: AddOn[];
  selectedAddOns: string[];
  relatedProducts: Product[];
  onToggleAddOn: (id: string) => void;
  onBuyNow: () => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  totalPrice,
  addOns,
  selectedAddOns,
  relatedProducts,
  onToggleAddOn,
  onBuyNow
}) => {
  return (
    <div className="sticky top-24 space-y-6">
      <PriceCard
        totalPrice={totalPrice}
        addOns={addOns}
        selectedAddOns={selectedAddOns}
        onToggleAddOn={onToggleAddOn}
        onBuyNow={onBuyNow}
      />

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  );
};

export default ProductSidebar;