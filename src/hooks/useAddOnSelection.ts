// hooks/useAddOnSelection.ts
import { useState } from "react";
import type { AddOn } from "../services/productService";

export const useAddOnSelection = (addOns: AddOn[]) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const getSelectedAddOnsData = (): AddOn[] => {
    return addOns.filter(
      (addon) => addon.id && selectedAddOns.includes(addon.id)
    );
  };

  const totalAddOnPrice = getSelectedAddOnsData().reduce(
    (sum, addon) => sum + addon.price,
    0
  );

  const clearSelection = () => {
    setSelectedAddOns([]);
  };

  return {
    selectedAddOns,
    toggleAddOn,
    getSelectedAddOnsData,
    totalAddOnPrice,
    clearSelection
  };
};