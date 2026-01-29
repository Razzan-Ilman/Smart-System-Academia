// utils/currency.ts
export const formatRupiah = (value: number): string => {
  return `IDR ${value.toLocaleString("id-ID")}`;
};